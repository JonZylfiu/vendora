import type UserResponseDto from "../dtos/user/user-response.dto.js";
import type IUser from "../models/interfaces/IUser.interface.js";


export const toUserResponseDto = (user: IUser): UserResponseDto => {
    const { name, surname, email, phone, city, location, rating_avg, rating_count, wishlist} = user;

    return {
        name,
        surname,
        email,
        city,
        location: location.coordinates,
        phone,
        rating_avg,
        rating_count,
        wishlist
    };
}