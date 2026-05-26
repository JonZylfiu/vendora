import type mongoose from "mongoose";
import type CitiesEnum from "../../enums/cities.enum.js";
import type UserRolesEnum from "../../enums/user-roles.enum.js";

export interface IUserLocation {
    type: "Point";
    coordinates: number[];
}

export default interface IUser {
    name: string;
    surname: string;
    email: string;
    hash_password: string;
    salt: string;
    age: number;
    phone: string;
    city: CitiesEnum;
    location: IUserLocation;
    wishlist: mongoose.Types.ObjectId[];
    rating_avg: number;
    rating_count: number;
    role: UserRolesEnum;

    createdAt?: Date;
    updatedAt?: Date;
}