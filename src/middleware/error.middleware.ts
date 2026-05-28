import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom.error.js";
import mongoose from "mongoose";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof CustomError) {
        const { statusCode, message } = err;
        
        return res.status(statusCode).json({
            data: null,
            message
        })
    }

    if(err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            data: null,
            message: err.message
        })
    }

    return res.status(500).json({
        data: null,
        message: err.message || "Something went wrong!"
    });
}