import { RESPONSE_MESSAGES } from "../config/constants.js";
import { JWTTokenVerifierType } from "../types/controllers/v1/auth.js";
import { JWTTokenSigner, JWTTokenVerifier } from "../utils/jwt/index.js";
import { apiHandler, ErrorHandlerClass } from "./errorHandling/index.js";
import { getUser, updateUser } from "../utils/db/user.services.db.js";
import { regenerateAccessTokenWithRefreshToken } from "../utils/google/index.js";
import { COOKIE_OPTIONS } from "../controllers/auth.controller.js";
import { CookieOptions } from "express";

const isUserAuthenticated = apiHandler(async (req, res, next) => {
  const authToken = req.cookies.auth_token;

  if (!authToken) {
    return next(
      new ErrorHandlerClass(
        "Authorization token is not exist",
        RESPONSE_MESSAGES.AUTH.CODES.UNAUTHORIZED
      )
    );
  }

  const data = JWTTokenVerifier<JWTTokenVerifierType>(authToken);

  if (!data) {
    return next(new ErrorHandlerClass("Authorization token is not valid", RESPONSE_MESSAGES.AUTH.CODES.UNAUTHORIZED))
  }

  const user = await getUser({ email: data.email });

  if (!user) {
    res.clearCookie("auth_token", RESPONSE_MESSAGES.COOKIE.CLEAR as CookieOptions)
    return next(new ErrorHandlerClass("Something went wrong", RESPONSE_MESSAGES.AUTH.CODES.UNAUTHORIZED))
  }

  if (data.isExpired) {
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

    const customAccessToken = JWTTokenSigner(userData, "1h"); // Generating access token with custom data

    await updateUser(user.id, {
      accessToken: googleAccessToken
    });


    res.cookie('auth_token', customAccessToken, COOKIE_OPTIONS);
  }

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    driveFileId: user.driveFileId
  }

  next();
});

export { isUserAuthenticated };
