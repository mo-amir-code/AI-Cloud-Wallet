import { CookieOptions } from "express";
import { ENV_VARS, RESPONSE_MESSAGES } from "../config/constants.js";
import { GOOGLE_CALLBACK_URL, GOOGLE_OAUTH_SCOPES } from "../config/google.js";
import { apiHandler, ok } from "../middlewares/errorHandling/index.js";
import { createUser, getUser, updateUser } from "../utils/db/user.services.db.js";
import { JWTTokenSigner } from "../utils/jwt/index.js";

const authenticateWithGoogle = apiHandler(async (req, res, next) => {
  const state = "some_state";

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
  sameSite: 'lax' as const,      // CSRF protection
  maxAge: 1 * 24 * 60 * 60 * 1000, // 7 day
  path: '/'
};

const googleCallback = apiHandler(async (req, res, next) => {
  const { code } = req.query;

  // Generating data to pass in body of exchange authorization code for access token
  const data = {
    code: code as any,
    client_id: ENV_VARS.GOOGLE.CLIENT_ID!,
    client_secret: ENV_VARS.GOOGLE.CLIENT_SECRET!,
    redirect_uri: ENV_VARS.SERVER_ORIGIN! + "/api/v1/auth/google/callback",
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

    // console.log("User data: ", userData)

    if (user) {
      user = await updateUser(googleId, userData)
    } else {
      userData["id"] = googleId;

      user = await createUser(userData);
    }

    // Create JWT token for your application
    const jwtToken = JWTTokenSigner(userObj, "1d");

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
              success: true,
              user: {
                email: "${email}",
                name: "${name}",
                picture: "${picture}"
              }
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

export { authenticateWithGoogle, googleCallback, revokeGoogleAccess, logoutUser };
