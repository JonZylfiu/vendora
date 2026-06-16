import type { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

type TokenPayload = {
    id: string,
    role: string
}

export const createToken = (payload: TokenPayload | string, expiresIn: SignOptions["expiresIn"] = "15m") => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(payload, JWT_SECRET!, {
        expiresIn,
        algorithm: "HS512"
    })

    return token;
}

export const decodeToken = (token: string): JwtPayload => {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    const payload = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    const { id, role } = payload;

    return {
        id,
        role
    };
}