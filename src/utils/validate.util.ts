import type { Model } from "mongoose";
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

export const checkEmptyArray = (array: any[], arrayName: string) => {
    if(array.length == 0) {
        throw new BadRequestError({
            message: `${arrayName} should not be empty!`
        });
    }
}

export const getEntityById = async (id: string, model: Model<any>) => {
    const entity = await model.findById(id);

    if (!entity) {
        throw new BadRequestError({
            message: `${model.modelName} with id ${id} does not exist!`
        });
    }

    return entity;
}