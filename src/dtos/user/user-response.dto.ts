import type CitiesEnum from "../../enums/cities.enum.js";
import type UserRolesEnum from "../../enums/user-roles.enum.js";
import type CartItem from "../../enums/cart-item.enum.js"


export default interface UserResponseDto {
    name: string,
    surname: string,
    email: string,
    city: CitiesEnum,
    phone: string,
    location: string[],
    rating_avg: number,
    rating_count: number,
    role: UserRolesEnum,
    cart: CartItem[],
}