import type { JwtPayload } from "./jwt-payload.type.ts";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}