import type { Response } from "express";

export const response = (data: any, message: string | null, code:number, res: Response) => {

    return res.status(code).json({
        data,
        message,
        success: code < 400
    });
}