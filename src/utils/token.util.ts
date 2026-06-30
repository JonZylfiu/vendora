import type { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import type UserJwtPayload from "../types/jwt-payload.type.js";


export const createToken = (payload: JwtPayload, expiresIn: SignOptions["expiresIn"] = "15m") => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(payload, JWT_SECRET!, {
        expiresIn,
        algorithm: "HS512"
    })

    return token;
}

export const decodeToken = (token: string): UserJwtPayload  => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
    
        const payload = jwt.verify(token, JWT_SECRET!) as JwtPayload;
        const { id, email, role } = payload;

        return {
            id,
            email,
            role
        };
        
    } catch(e: any) {
        throw new NotAuthorizedError({
            message: "You're not authorized!",
            code: 401

        });
    }
}