import bcrypt from "bcrypt";
import type { JwtPayload } from "jsonwebtoken";
import { type Request, type Response } from "express"

import type LoginRequestDto from "../dtos/auth/login-request-dto.js"
import User from "../models/user.model.js";
import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { toUserResponseDto } from "../mapper/user.mapper.js";
import { validateEmptyString, validateNegativeNumber } from "../utils/validation.util.js";
import type UserResponseDto from "../dtos/user/user-response.dto.js";
import { createToken } from "../utils/token.util.js";


export const registerUser = async (request: UserRequestDto) => {
    console.log(request)
    validateRegister(request);
    const { name, surname, email, password, city, age, phone, location } = request;

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

const loginUser = async (req: Request<{}, {}, LoginRequestDto>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // export default interface UserResponseDto {
    //     name: string,
    //     surname: string,
    //     email: string,
    //     city: CitiesEnum,
    //     phone: string,
    //     location: string[],
    //     rating_avg: number,
    //     rating_count: number,
    //     role: UserRolesEnum,
    //     cart: CartItem[],
    // }

    
    const data = {};

    // return data;
}


const validateRegister = (data: UserRequestDto) => {
    const { name, surname, email, password, age, phone, location } = data;
    
    validateEmptyString(name, "name");
    validateEmptyString(surname, "surname");
    validateEmptyString(email, "email");
    validateEmptyString(password, "password");
    validateEmptyString(phone, "phone");
    validateNegativeNumber(age, "age");
    validateNegativeNumber(location[0], "X coordinate");
    validateNegativeNumber(location[1], "Y coordinate");
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