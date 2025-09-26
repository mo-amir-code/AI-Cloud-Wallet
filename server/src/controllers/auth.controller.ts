import { ENV_VARS } from "../config/constants.js";
import { GOOGLE_CALLBACK_URL, GOOGLE_OAUTH_SCOPES } from "../config/google.js";
import { apiHandler, ok } from "../middlewares/errorHandling/index.js";
import jwt from "jsonwebtoken"
import { createUser, getUser, updateUser } from "../utils/db/user.services.db.js";

const authenticateWithGoogle = apiHandler(async (req, res, next) => {
  const state = "some_state";

  const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${ENV_VARS.GOOGLE.OAUTH_URL}?client_id=${ENV_VARS.GOOGLE.CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;

  // res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);

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
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

const googleCallback = apiHandler(async (req, res, next) => {
  // console.log(req.query);

  const { code } = req.query;

  // Generating data to pass in body of exchange authorization code for access token
  const data = {
    code,
    client_id: ENV_VARS.GOOGLE.CLIENT_ID,
    client_secret: ENV_VARS.GOOGLE.CLIENT_SECRET,
    redirect_uri: ENV_VARS.SERVER_ORIGIN + "/api/v1/auth/google/callback",
    grant_type: "authorization_code",
  };

  try {
    // Exchange authorization code for access token & id_token
    const response = await fetch(ENV_VARS.GOOGLE.ACCESS_TOKEN_URL!, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const access_token_data = await response.json();

    const { id_token } = access_token_data;

    // Verify and extract the information in the id token
    const token_info_response = await fetch(
      `${ENV_VARS.GOOGLE.TOKEN_INFO_URL}?id_token=${id_token}`
    );

    const token_info_res_data = await token_info_response.json();

    // Extract user information
    const { email, name, picture, sub: googleId } = token_info_res_data;

    const userObj = {
      id: googleId,
      name,
      email,
      picture
    }

    // console.log("User Object: ", userObj)

    // Creating/Updating user
    let user = await getUser({
      id: googleId
    });

    if (user) {
      user = await updateUser(googleId, { email, name })
    } else {
      user = await createUser(userObj);
    }

    // Create JWT token for your application
    const jwtToken = jwt.sign(
      userObj,
      ENV_VARS.JWT_SECRET,
      { expiresIn: '7d' }
    );

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

export { authenticateWithGoogle, googleCallback };
