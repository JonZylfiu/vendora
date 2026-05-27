import bcrypt from "bcrypt";
import type { JwtPayload } from "jsonwebtoken";
import { type Request, type Response } from "express"

import type LoginRequestDto from "../dtos/auth/login-request-dto.js"
import User from "../models/user.model.js";
import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { toUserResponseDto } from "../mapper/user.mapper.js";
import { validateCity, validateEmptyString, validateNegativeNumber } from "../utils/validation.util.js";
import type UserResponseDto from "../dtos/user/user-response.dto.js";
import { createToken } from "../utils/token.util.js";


export const registerUser = async (request: UserRequestDto) => {
    validateRegister(request);
    const { name, surname, email, password, city, age, phone, location } = request;

    const exists = await User.findOne({ email });

    if(exists) {
        throw new Error(`User with email: ${email} already exists!`);
    }

    const user = await User.create({
        name,
        surname,
        email,
        hash_password: await encryptPassword(password),
        age,
        city,
        phone,
        location: {
            type: "Point",
            coordinates: location
        }
    });

    if(!user) {
        throw new Error("User did not get created!");
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

export const loginUser = async (request: LoginRequestDto) => {
    const { email, password } = request;

    validateEmptyString(email, "email");
    validateEmptyString(password, "password");

    const user = await User.findOne({ email });

    if(!user) {
        throw new Error("Email or password is incorrect!");
    }

    const correctPassword = await verifyPassword(password, user.hash_password);

    if(!correctPassword) {
        throw new Error("Email or password is incorrect!");
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


const validateRegister = (data: UserRequestDto) => {
    const { name, surname, email, password, age, city, phone, location } = data;
    
    validateEmptyString(name, "name");
    validateEmptyString(surname, "surname");
    validateEmptyString(email, "email");
    validateEmptyString(password, "password");
    validateEmptyString(phone, "phone");
    validateNegativeNumber(age, "age");
    validateNegativeNumber(location[0], "X coordinate");
    validateNegativeNumber(location[1], "Y coordinate");
    validateCity(city);
}

const encryptPassword = async (passwordPlain: string): Promise<string> => {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    
    const passwordHash = await bcrypt.hash(passwordPlain, saltRounds!);

    return passwordHash;
}

const verifyPassword = async (passwordPlain: string, passwordHashed: string): Promise<boolean> => {
    const saltRounds = Number(process.env.SALT_ROUNDS);

    return await bcrypt.compare(passwordPlain, passwordHashed);
}