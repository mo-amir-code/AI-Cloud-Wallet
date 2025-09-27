import jwt from "jsonwebtoken";
import { JWTTokenVerifierType } from "../../types/controllers/v1/auth.js";
import { ENV_VARS, JWT_CONSTANTS } from "../../config/constants.js";
import { JWTExpiryType } from "../../types/utils/jwt/index.js";
import { UserDataType } from "../../types/db/schema/index.js";

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

const JWTTokenVerifier = <T>(token: string): T | null => {
  try {
    const res = jwt.verify(
      token,
      ENV_VARS.JWT_SECRET as string
    ) as any;

    return {
      ...res,
      isExpired: false
    } as T
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      const payload = jwt.decode(token) as T;
      return {
        ...payload,
        isExpired: true
      }
    }
    return null;
  }
};

const JWTTokenSigner = <T extends string | object>(data: T, expiry: JWTExpiryType): string | null => {
  try {
    const token = jwt.sign(
      data,
      ENV_VARS.JWT_SECRET as string,
      {
        expiresIn: expiry
      }
    );

    return token
  } catch (err) {
    return null;
  }
};

export { isJwtTokenExpired, JWTTokenVerifier, JWTTokenSigner };
