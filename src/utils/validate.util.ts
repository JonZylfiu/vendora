import BadRequestError from "../errors/bad-request.error.js"


export const validateEnum = (value: any, _enum: any) => {
    if(!Object.values(_enum).includes(value as typeof _enum)) {
        throw new BadRequestError({
            message: `${value} is not a valid argument!`
        });
    }
}