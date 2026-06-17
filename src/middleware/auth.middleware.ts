import { type NextFunction, type Request, type Response } from "express";
import { decodeToken } from "../utils/token.util.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if(!token) {
        throw new NotAuthorizedError({
            message: "You're not authorized!",
            code: 401
        });
    }

    const payload = decodeToken(token!);
    
    req.user = payload;

    next();
}
