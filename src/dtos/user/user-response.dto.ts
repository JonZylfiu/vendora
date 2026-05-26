import mongoose from "mongoose";
import CitiesEnum from "../../enums/cities.enum.js";

export default interface UserResponseDto {
    name: string,
    surname: string,
    email: string,
    city: CitiesEnum,
    phone: string,
    location: number[],
    rating_avg: number,
    wishlist: mongoose.Types.ObjectId[],
    rating_count: number
}
