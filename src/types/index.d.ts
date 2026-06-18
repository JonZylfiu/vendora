import type UserJwtPayload from "./jwt-payload.type.ts";


declare global {
    namespace Express {
        interface Request {
            user: UserJwtPayload;
        }
    }
}