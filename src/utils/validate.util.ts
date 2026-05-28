import BadRequestError from "../errors/bad-request.error.js"
import NotAuthorizedError from "../errors/not-authorized.error.js";
import type JwtPayload from "../types/jwt-payload.type.js";


export const validateEnum = (value: any, _enum: any) => {
    if(!Object.values(_enum).includes(value as typeof _enum)) {
        throw new BadRequestError({
            message: `${value} is not a valid argument!`
        });
    }
}

export const checkIsAuthorized = (id: string, user: JwtPayload) => {
    if (id != user.id && user.role !== "ADMIN") {
        throw new NotAuthorizedError({
            message: "You're not authorized for this operation"
        });
    }
}