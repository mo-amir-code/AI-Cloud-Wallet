import jwt from "jsonwebtoken";
import { JWTTokenVerifierType } from "../../types/controllers/v1/auth.js";
import { ENV_VARS, JWT_CONSTANTS } from "../../config/constants.js";

const isJwtTokenExpired = (token: string | undefined): boolean => {
  if (!token) {
    return true;
  }

  const { exp } = jwt.verify(token, ENV_VARS.JWT_SECRET) as { exp: number };

  if (JWT_CONSTANTS.CURRENT_DATE > exp) {
    return true;
  }

  return false;
};

const JWTTokenVerifier = (token: string): JWTTokenVerifierType | null => {
  try {
    return jwt.verify(
      token,
      ENV_VARS.JWT_SECRET as string
    ) as JWTTokenVerifierType;
  } catch (err) {
    return null;
  }
};

export { isJwtTokenExpired, JWTTokenVerifier };
