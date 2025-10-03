import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { APIHandlerType, APISuccessType } from "../../types/services/errorHandling/index.js";


class ErrorHandlerClass extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler: ErrorRequestHandler = async (err: ErrorHandlerClass, req: Request, res: Response, next: NextFunction) => {
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    res.status(err.statusCode).json({
        success: false,
        message: err?.message
    });
}

const apiHandler = (func: APIHandlerType) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch((err) => {
        console.error("Error Occurred: ", err);
        next()
    });
}

const ok = ({ res, statusCode = 200, message, data }: APISuccessType) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    })
}

export {
    ErrorHandlerClass,
    errorHandler,
    apiHandler,
    ok
}