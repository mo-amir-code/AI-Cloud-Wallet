import { RESPONSE_MESSAGES } from "../config/constants.js";
import { apiHandler, ErrorHandlerClass } from "./errorHandling/index.js";

const isUserAuthenticated = apiHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(
      new ErrorHandlerClass(
        "No authorization header",
        RESPONSE_MESSAGES.AUTH.CODES.UNAUTHORIZED
      )
    );
  }

  const idToken = authHeader.split("Bearer ")[1];
  if (!idToken) {
    return next(
      new ErrorHandlerClass(
        "Invalid authorization header",
        RESPONSE_MESSAGES.AUTH.CODES.UNAUTHORIZED
      )
    );
  }

  // Logic is here
});

export { isUserAuthenticated };
