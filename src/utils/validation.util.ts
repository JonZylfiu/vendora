import CitiesEnum from "../enums/cities.enum.js";
import ValidationError from "../errors/validate.error.js";



export const validateNull = (value: any, field: string) => {
    if(value == null) {
        throw new ValidationError(`Error: ${field} must not be null!`);
    }
}

export const validateEmptyString = (value: string, field: string) => {
    validateNull(value, field);

    if(value.length == 0) {
        throw new ValidationError(`Error: ${field} must not be empty!`);
    }
}

export const validateNegativeNumber = (value: number, field: string) => {
    validateNull(value, field);
    
    if(value < 0) {
        throw new ValidationError(`Error: ${field} must not lower than 0!`);
    }
} 

export const validateCity = (value: string) => {
    const normalized = value.trim().toUpperCase();
    if (!Object.values(CitiesEnum).includes(normalized as CitiesEnum)) {
        throw new ValidationError("Invalid city");
    }
};