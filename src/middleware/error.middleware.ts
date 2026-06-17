import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom.error.js";
import mongoose from "mongoose";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {


    // Check if error is a custom error.
    if(err instanceof CustomError) {
        console.log(err);

        const { statusCode, message } = err;
        
        return res.status(statusCode).json({
            message,
            success: false
        })
    }

    // check if error comes from mongoose validation 
    if(err instanceof mongoose.Error.ValidationError) {
        console.log(err);
        return res.status(400).json({
            message: err.message,
            success: false
        })
    }

    // uncaught errors
    return res.status(500).json({
        message: err.message || "Something went wrong!",
        success: false
    });
}