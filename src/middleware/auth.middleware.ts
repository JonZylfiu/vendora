import { type NextFunction, type Request, type Response } from "express";
import { decodeToken } from "../utils/token.util.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if(!token) {
        return res.status(403).json({
            data: null,
            message: "You're not authorized!"
        });
    }

    const payload = decodeToken(token!);
    const { id, role } = payload;

    req.body.id = id;
    req.body.role = role;

    next();
}