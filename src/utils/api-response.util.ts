import type { Response } from "express";

export const response = (res: Response, code:number, message: string | null, data?: any | null) => {
    
    if(data) {
        // return data, if data is provided
        return res.status(code).json({
            data,
            message,
            success: code < 400
        });
    } else {
        // return only the message, if data is not provided.
        return res.status(code).json({
            message,
            success: code < 400
        });
    }
    
}
