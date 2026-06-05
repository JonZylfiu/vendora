import type UserRequestDto from "../dtos/user/user-request.dto.js";
import type UserResponseDto from "../dtos/user/user-response.dto.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import { toUserResponseDto } from "../mapper/user.mapper.js";
import type IUser from "../models/interfaces/IUser.interface.js";
import User from "../models/user.model.js";
import type JwtPayload from "../types/jwt-payload.type.js";
import { checkIsAuthorized, getEntityById } from "../utils/validate.util.js";



export const getUserById = async (id: string): Promise<UserResponseDto> => {
    const user = await getEntityById(id, User);

    return toUserResponseDto(user);
}


export const updateUser = async (id: string, data: UserRequestDto, user: JwtPayload): Promise<UserResponseDto> => {
    const dbUser = await getEntityById(id, User);
    const { name, surname, city, age, location } = data;


    checkIsAuthorized(dbUser.id, user);

    const updatedUser = await User.findOneAndReplace(
        {
            id
        },  
        {
            name,
            surname,
            age,
            city,
            location: {
                type: "Point",
                coordinates: location
            }
        }
    );

    return toUserResponseDto(updatedUser!);
}

export const deleteUser = async (id: string, user: JwtPayload) => {
    const dbUser = await getEntityById(id, User);

    checkIsAuthorized(dbUser.id, user);

    await dbUser.deleteOne();
    return true;
}

export const getAllUsers = async (user: JwtPayload): Promise<UserResponseDto[]> => {
    const users = await User.find();

    if(user.role != "ADMIN") {
        throw new NotAuthorizedError({
            message: "You're not authorized for this operation",
            code: 403
        });
    }

    return users.map(user => toUserResponseDto(user));
}