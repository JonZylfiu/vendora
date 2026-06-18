import bcrypt from "bcrypt";

import type LoginRequestDto from "../dtos/auth/login-request-dto.js"
import User from "../models/user.model.js";
import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { toUserResponseDto } from "../mapper/user.mapper.js";
import type UserResponseDto from "../dtos/user/user-response.dto.js";
import { createToken, decodeToken } from "../utils/token.util.js";
import ConflictError from "../errors/conflict.error.js";
import BadRequestError from "../errors/bad-request.error.js";
import CitiesEnum from "../enums/cities.enum.js";
import { getEntityById, validateEnum } from "../utils/validate.util.js";
import emailEmitter from "../events/email.event.js";
import type UserJwtPayload from "../types/jwt-payload.type.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import type IUser from "../models/interfaces/IUser.interface.js";


export const registerUser = async (request: UserRequestDto) => {
    const { name, surname, email, password, city, age, phone, location } = request;

    // validate data which cannot be validated by middleware
    validateEnum(city, CitiesEnum);
    validatePhoneNumber(phone);

    // Check if the email is being used.
    const exists = await User.findOne({ email });
    
    if(exists) {
        throw new ConflictError({message: `user with email ${email} already exists!`});
    }

    // create user
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

    // send verification token
    sendEmailVerificationToken(user);

    // return true if everything was done successfully
    return true
}

export const loginUser = async (request: LoginRequestDto) => {
    const { email, password } = request;

    // check if user exists, if not throw error
    const user = await User.findOne({ email });

    if(!user) {
        throw new BadRequestError({message: "Email or password is incorrect!"});
    }

    if(!user.isVerified) {
        throw new NotAuthorizedError({message: "You are not verified!"});
    }

    // check if the password is correct, if not throw error
    const correctPassword = await verifyPassword(password, user.password);

    if(!correctPassword) {
        throw new BadRequestError({message: "Email or password is incorrect!"});
    }

    // convert user data to UserResponseDto
    const data: UserResponseDto = toUserResponseDto(user);
    
    // create payload for jwt token
    const payload: UserJwtPayload = {
        id: user.id,
        role: user.role
    };

    // create jwt token
    const jwtToken = createToken(payload);
    
    return {
        user: data,
        token: jwtToken
    };
}

export const verifyUserEmail = async (token: string) => {
    const payload = decodeToken(token);
    const { id } = payload;
    const user = await getEntityById(id, User);

    // check if user is already verified
    if(user.isVerified) {
        throw new BadRequestError({ message: "Already verified" });
    }

    // change isVerified to true
    await User.findByIdAndUpdate(id, {
        isVerified: true
    });

    return true;
}

export const resendUserVerificationToken = async (email: string) => {
    const user = await User.findOne({
        email
    });

    if(!user) {
        throw new ConflictError({message: `User with email ${email} does not exists!`});
    }

    // check if user is already verified
    if(user.isVerified) {
        throw new BadRequestError({ message: "Already verified" });
    }

    // send verification token
    sendEmailVerificationToken(user);

    return true;
} 

const encryptPassword = async (passwordPlain: string): Promise<string> => {
    const saltRounds = Number(process.env.SALT_ROUNDS);   
    const passwordHash = await bcrypt.hash(passwordPlain, saltRounds!);

    return passwordHash;
}

// verifies whether the plain password matches the hashed one.
const verifyPassword = async (passwordPlain: string, passwordHashed: string): Promise<boolean> => await bcrypt.compare(passwordPlain, passwordHashed);

// Uses regex to check whether phoneNumber is valid Kosovo phone number 
const validatePhoneNumber = (phoneNumber: string): void => {
    const regex = /^(\+383|383)\d{8}$/;

    if (!regex.test(phoneNumber)) {
        throw new BadRequestError({
            message: "Invalid phone number!"
        });
    }
};

const sendEmailVerificationToken = (user: IUser) => {
    const { _id: id, name, surname, email } = user;
    const fullName = `${name} ${surname}`;

    // Create verification token.
    const verificationTokenPayload = {
        id
    };
    const verificationToken = createToken(verificationTokenPayload);

    // emit 'verification-email' event, for sending a verification email
    emailEmitter.emit("verification-email", fullName, email, verificationToken);
}