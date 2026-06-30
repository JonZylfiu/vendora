import type UserRequestDto from "../dtos/user/user-request.dto.js";
import type UserResponseDto from "../dtos/user/user-response.dto.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import { toUserResponseDto } from "../mapper/user.mapper.js";
import User from "../models/user.model.js";
import type UserJwtPayload  from "../types/jwt-payload.type.js";
import { checkIsAuthorized, getEntityById } from "../utils/validate.util.js";



export const getUserByIdService = async (id: string): Promise<UserResponseDto> => {
    const user = await getEntityById(id, User);

    return toUserResponseDto(user);
}

export const updateUserService = async (id: string, data: UserRequestDto, user: UserJwtPayload): Promise<UserResponseDto> => {
    const dbUser = await getEntityById(id, User);
    const { name, surname, city, age, location } = data;


    checkIsAuthorized(dbUser.id, user);

    const update: any = {};

    if(name !== undefined) update.name = name;
    if(surname !== undefined) update.surname = surname;
    if(age !== undefined) update.age = age;
    if(city !== undefined) update.city = city;
    if(location !== undefined) {
        update.location = {
            type: "Point",
            coordinates: location
        };
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $set: update
        },
        {
            new: true,
            runValidators: true
        }
    );

    return toUserResponseDto(updatedUser!);
}

export const deleteUserService = async (id: string, user: UserJwtPayload) => {
    const dbUser = await getEntityById(id, User);

    checkIsAuthorized(dbUser.id, user);

    await dbUser.deleteOne();
    return true;
}

export const getAllUsersService = async (user: UserJwtPayload): Promise<UserResponseDto[]> => {
    const users = await User.find();

    if(user.role != "ADMIN") {
        throw new NotAuthorizedError({
            message: "You're not authorized for this operation",
            code: 403
        });
    }

    return users.map(user => toUserResponseDto(user));
}