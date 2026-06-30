import type { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/bad-request.error.js";
import mongoose from "mongoose";

export const validateHasParameter = (...args: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;

        for (const arg of args) {
            if(body[arg] === undefined) {
                throw new BadRequestError({
                    message: `${arg} not specified`
                });
            }
        }

        next();
    }
}

export const validatePasswordFormat = (req: Request, res: Response, next: NextFunction) => {
    const password = req.body?.password ?? req.body?.newPassword;

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    if(!password || !regex.test(password)) {
        throw new BadRequestError({
            message: "Password must contain at least 8 characters, one uppercase letter, one digit and one special character.",
        })
    }

    next();
};

export const validateEmailFormat = (req: Request, res: Response, next: NextFunction) => {
    const email  = req.body?.email;
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!email || !regex.test(String(email).toLowerCase())) {
        throw new BadRequestError({
            message: "Email is not valid!"
        })
    }
    
    next();
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError({
            message: "Invalid id"
        });
    }

    next();
}

type EnumType = Record<string, string | number>

export const validateEnum = (values: Record<string, EnumType>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const [field, enumObj] of Object.entries(values)) {
            const input = req.body[field] ?? req.params[field];

            if (!Object.values(enumObj).includes(input)) {
                throw new BadRequestError({
                    message: `${field} is not a valid argument!`
                });
            }
        }

        next();
    }
}
