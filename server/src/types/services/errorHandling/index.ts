import { NextFunction, Request, Response } from "express";

type APIHandlerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>

interface APISuccessType {
    res: Response,
    statusCode?: number,
    message: string,
    data?: any
}

export {
    APIHandlerType,
    APISuccessType
}