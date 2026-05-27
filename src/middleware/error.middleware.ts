import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom.error.js";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof CustomError) {
        const { statusCode, message } = err;
        
        return res.status(statusCode).json({
            data: null,
            message
        })
    }

    return res.status(500).json({
        data: null,
        message: "Something went wrong!"
    });
}