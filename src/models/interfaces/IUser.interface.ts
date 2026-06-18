import type mongoose from "mongoose";
import type CitiesEnum from "../../enums/cities.enum.js";
import type UserRolesEnum from "../../enums/user-roles.enum.js";

export interface IUserLocation {
    type: "Point";
    coordinates: number[];
}

export default interface IUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    surname: string;
    email: string;
    password: string;
    age: number;
    phone: string;
    city: CitiesEnum;
    location: IUserLocation;
    isVerified: Boolean;
    role: UserRolesEnum;

    createdAt?: Date;
    updatedAt?: Date;
}