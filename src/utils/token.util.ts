import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const createToken = (payload: JwtPayload) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(payload, JWT_SECRET!, {
        expiresIn: '15m',
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