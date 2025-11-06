import { CookieOptions } from "express";
import { ENV_VARS, RESPONSE_MESSAGES } from "../config/constants.js";
import { getGoogleCallbackURL, GOOGLE_OAUTH_SCOPES } from "../config/google.js";
import { apiHandler, ErrorHandlerClass, ok } from "../middlewares/errorHandling/index.js";
import { createUser, getUser, updateUser } from "../utils/db/user.services.db.js";
import { JWTTokenSigner, JWTTokenVerifier } from "../utils/jwt/index.js";
import { DriveFileType } from "../types/services/drive/index.js";
import { uploadJsonFile } from "../services/drive/index.js";
import { getDrive } from "../services/drive/config.js";
import { createWallet } from "../utils/solana/index.js";
import { AuthWithGoogleBodyType, JWTTokenVerifierType } from "../types/controllers/v1/auth.js";
import { regenerateAccessTokenWithRefreshToken } from "../utils/google/index.js";
import { createSettings } from "../utils/db/settings.services.db.js";

const authenticateWithGoogle = apiHandler(async (req, res, next) => {
  const { redirectUri, from } = req.body as AuthWithGoogleBodyType;

  let state = "browser_state";

  // console.log(redirectUri)

  if (from === "mobile") {
    state = Buffer.from(
      JSON.stringify({ redirectUri })
    ).toString('base64');
  }

  const GOOGLE_CALLBACK_URL = getGoogleCallbackURL(req);

  const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${ENV_VARS.GOOGLE.OAUTH_URL}?client_id=${ENV_VARS.GOOGLE.CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;

  return ok({
    res,
    message: "redirected",
    data: {
      redirect_url: GOOGLE_OAUTH_CONSENT_SCREEN_URL
    }
  })
});

// Cookie configuration
export const COOKIE_OPTIONS = {
  httpOnly: true,        // Prevents XSS attacks
  secure: ENV_VARS.ENV !== 'development', // HTTPS only in production
  sameSite: 'none' as const,      // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

const googleCallback = apiHandler(async (req, res, next) => {
  const { code, state } = req.query;
  const serverUrl = getGoogleCallbackURL(req);

  // Generating data to pass in body of exchange authorization code for access token
  const data = {
    code: code as any,
    client_id: ENV_VARS.GOOGLE.CLIENT_ID!,
    client_secret: ENV_VARS.GOOGLE.CLIENT_SECRET!,
    redirect_uri: serverUrl,
    grant_type: "authorization_code",
  };

  try {
    // Exchange authorization code for access token & id_token
    const response = await fetch(ENV_VARS.GOOGLE.ACCESS_TOKEN_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    });

    const access_token_data = await response.json();

    const { id_token, access_token, refresh_token } = access_token_data;

    // Verify and extract the information in the id token
    const token_info_response = await fetch(
      `${ENV_VARS.GOOGLE.TOKEN_INFO_URL}?id_token=${id_token}`
    );

    const token_info_res_data = await token_info_response.json();

    // Extract user information
    const { email, name, picture, sub: googleId } = token_info_res_data;

    const userObj = {
      name,
      email,
      picture
    }

    // Creating/Updating user
    let user = await getUser({
      id: googleId
    });

    let userData: any = { ...userObj };

    if (refresh_token) {
      userData["refreshToken"] = refresh_token;
    }

    userData["accessToken"] = access_token;

    if (user) {
      user = await updateUser(googleId, userData)
    } else {
      userData["id"] = googleId;

      const wallet = createWallet();

      // JSON data of the user file
      const fileData: DriveFileType = {
        name: userData.name,
        email: userData.email,
        wallet: wallet,
        contacts: []
      }

      // Getting drive instance of the user
      const drive = getDrive({
        user: {
          accessToken: access_token,
          refreshToken: refresh_token
        },
        req
      });

      // Uploading json file into user's drive
      userData["driveFileId"] = await uploadJsonFile(drive, fileData);

      user = await createUser(userData);
      await createSettings({ userId: user.id, mode: "mainnet" });
    }

    // Create JWT token for your application
    const jwtToken = JWTTokenSigner(userObj, "1h", true);


    if (state !== "browser_state") {
      // Decode the state to get the app's redirect URI
      let appRedirectUri: string;
      try {
        const decoded = JSON.parse(Buffer.from(state as string, 'base64').toString());
        appRedirectUri = decoded.redirectUri;
      } catch (error) {
        console.error('Failed to decode state:', error);
        return res.status(400).send('Invalid state parameter');
      }

      // Build the redirect URL back to the app
      const finalRedirectUrl = `${appRedirectUri}?jwt=${encodeURIComponent(jwtToken as string)}`;

      // console.log("FInal redirect URI: ", finalRedirectUrl)

      // Redirect back to the mobile app
      res.redirect(finalRedirectUrl);

      return;
    }



    // Set HTTP-only cookie with the JWT token
    res.cookie('auth_token', jwtToken, COOKIE_OPTIONS);

    // Send success response to popup (no token in response)
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>OAuth Callback</title>
      </head>
      <body>
        <script>
          // Send success message back to parent window (no sensitive data)
          if (window.opener) {
            window.opener.postMessage({ 
              success: true
            }, "*");
          }

          // Close the popup
          window.close();
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>OAuth Error</title>
      </head>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ 
              success: false, 
              error: "Authentication failed" 
            }, "*");
          }
          window.close();
        </script>
      </body>
      </html>
    `);
  }
});

const refreshToken = apiHandler(async (req, res, next) => {
  const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandlerClass("Authorization token is not exist",
      RESPONSE_MESSAGES.AUTH.CODES.UNAUTHORIZED))
  }

  const payload = JWTTokenVerifier<JWTTokenVerifierType>(token);

  if (payload === null) {
    return next(new ErrorHandlerClass("Something went wrong!",
      RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST))
  }

  const user = await getUser({ id: payload.id });

  if (!user) {
    return next(new ErrorHandlerClass("Something went wrong!",
      RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST))
  }

  if (!user.refreshToken) {
    res.clearCookie("auth_token", RESPONSE_MESSAGES.COOKIE.CLEAR as CookieOptions)
    return next(new ErrorHandlerClass("Session expired", RESPONSE_MESSAGES.AUTH.CODES.UNAUTHORIZED))
  }

  const googleAccessToken = await regenerateAccessTokenWithRefreshToken(user.refreshToken);

  if (!googleAccessToken) {
    res.clearCookie("auth_token", RESPONSE_MESSAGES.COOKIE.CLEAR as CookieOptions)
    return next(new ErrorHandlerClass("Session expired", RESPONSE_MESSAGES.AUTH.CODES.UNAUTHORIZED))
  }

  const userData = {
    name: user.name,
    email: user.email,
    picture: user.picture
  }

  const jwtToken = JWTTokenSigner(userData, "1h", true);

  await updateUser(user.id, {
    accessToken: googleAccessToken
  });

  return ok({
    res,
    message: "token has been refreshed",
    data: {
      token: jwtToken
    }
  })
});

const logoutUser = apiHandler(async (req, res, next) => {
  res.clearCookie("auth_token", RESPONSE_MESSAGES.COOKIE.CLEAR as CookieOptions);

  return ok({
    res,
    message: "User logged out"
  })
});

const revokeGoogleAccess = apiHandler(async (req, res, next) => {
  const userId = req.user.id;

  try {

    let revokeSuccess = false;

    if (userId) {
      // Get user's stored tokens
      const user = await getUser({ id: userId });
      console.log(user)

      if (user && user.accessToken) {
        try {
          // Decrypt refresh token
          const accessToken = user.accessToken;

          // Revoke the refresh token (this invalidates all tokens for your app)
          const revokeResponse = await fetch(ENV_VARS.GOOGLE.AUTH_REVOKE!, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              token: accessToken // Can use refresh_token or access_token
            })
          });

          console.log("Revoke Response: ", revokeResponse)

          if (revokeResponse.ok) {
            revokeSuccess = true;
          } else {
            console.warn(`⚠️ Token revocation failed: ${revokeResponse.status}`);
            // Continue anyway - maybe tokens were already invalid
            revokeSuccess = false;
          }

        } catch (error) {
          console.error("❌ Error revoking tokens:", error);
          // Continue with cleanup even if revocation fails
        }

        // Clear tokens from database regardless of revocation success
        await updateUser(userId, {
          accessToken: null,
          refreshToken: null
        });
      }
    }

    // Clear local session cookie
    res.clearCookie('auth_token', RESPONSE_MESSAGES.COOKIE.CLEAR as CookieOptions);

    console.log("✅ App access revoked and local session cleared");

    return ok({
      res,
      message: "Google access revoked and logged out",
      data: {
        logoutLevel: "revoked",
        tokenRevoked: revokeSuccess,
        note: "You're logged out and this app can no longer access your Google account"
      }
    });

  } catch (error) {
    console.error('❌ Google access revocation error:', error);

    // Still clear local session even if revocation fails
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return res.status(500).json({
      success: false,
      message: 'Logout completed but token revocation may have failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const checkIsUserAuthenticated = apiHandler(async (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

  console.log("COOKIES: ", req.cookies)
  // console.log("Token:  ", token)
  // console.log("Headers: ", req.headers)

  if (!token) {
    return next(new ErrorHandlerClass("Authorization token is not exist",
      RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST))
  }

  const payload = JWTTokenVerifier<JWTTokenVerifierType>(token);

  if (payload === null) {
    return next(new ErrorHandlerClass("Something went wrong", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST));
  }

  return ok({
    res,
    message: "user is authenticated"
  })
});

export { authenticateWithGoogle, googleCallback, refreshToken, revokeGoogleAccess, logoutUser, checkIsUserAuthenticated };
