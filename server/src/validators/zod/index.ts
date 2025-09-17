import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { ErrorHandlerClass } from "../../middlewares/errorHandling/index.js";
import { RESPONSE_MESSAGES } from "../../config/constants.js";

const zodValidation =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("Before zod");
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      // console.log("After zod");
      return next();
    } catch (error: any) {
      // console.log("Zod error: ", error);
      const msgs = JSON.parse(error?.message);
      return next(
        new ErrorHandlerClass(
          msgs[0]?.message,
          RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST
        )
      );
    }
  };

export { zodValidation };
