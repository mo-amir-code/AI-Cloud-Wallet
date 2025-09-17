import { Request } from "express";
import { UserType } from "./controllers/user.ts";

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user: UserType; // Add the 'user' property of any type
    }
  }
}
