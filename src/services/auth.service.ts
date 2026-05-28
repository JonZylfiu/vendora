import bcrypt from "bcrypt";
import type { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

import type LoginRequestDto from "../dtos/auth/login-request-dto.js"
import User from "../models/user.model.js";
import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { toUserResponseDto } from "../mapper/user.mapper.js";
import type UserResponseDto from "../dtos/user/user-response.dto.js";
import { createToken } from "../utils/token.util.js";
import ConflictError from "../errors/conflict.error.js";
import BadRequestError from "../errors/bad-request.error.js";
import CitiesEnum from "../enums/cities.enum.js";


export const registerUser = async (request: UserRequestDto) => {
    const { name, surname, email, password, city, age, phone, location } = request;

    validateCity(city);
    validatePhoneNumber(phone);

    const exists = await User.findOne({ email });

    if(exists) {
        throw new ConflictError({message: `already exists!`});
    }

    const user = await User.create({
        name,
        surname,
        email,
        password: await encryptPassword(password),
        age,
        city,
        phone,
        location: {
            type: "Point",
            coordinates: location
        }
    });
    
    const data: UserResponseDto = toUserResponseDto(user);
    
    const payload: JwtPayload = {
        id: user.id,
        role: user.role
    };
    const jwtToken = createToken(payload);
    
    return {
        user: data,
        token: jwtToken
    };
}


export const loginUser = async (request: LoginRequestDto) => {
    const { email, password } = request;

    const user = await User.findOne({ email });

    if(!user) {
        throw new BadRequestError({message: "Email or password is incorrect!"});
    }

    const correctPassword = await verifyPassword(password, user.password);
    if(!correctPassword) {
        throw new BadRequestError({message: "Email or password is incorrect!"});
    }

    const data: UserResponseDto = toUserResponseDto(user);
    
    const payload: JwtPayload = {
        id: user.id,
        role: user.role
    };

    const jwtToken = createToken(payload);
    
    return {
        user: data,
        token: jwtToken
    };
}

const encryptPassword = async (passwordPlain: string): Promise<string> => {
    const saltRounds = Number(process.env.SALT_ROUNDS);   
    const passwordHash = await bcrypt.hash(passwordPlain, saltRounds!);

    return passwordHash;
}

const verifyPassword = async (passwordPlain: string, passwordHashed: string): Promise<boolean> => {

    return await bcrypt.compare(passwordPlain, passwordHashed);
}


const validateCity = (city: string): void => {
    if (!Object.values(CitiesEnum).includes(city as CitiesEnum)) {
        throw new BadRequestError({
            message: "Invalid city!"
        });
    }
};

const validatePhoneNumber = (phoneNumber: string): void => {
    const regex = /^(\+383|383)\d{8}$/;

    if (!regex.test(phoneNumber)) {
        throw new BadRequestError({
            message: "Invalid phone number!"
        });
    }
};