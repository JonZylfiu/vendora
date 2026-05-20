import type CitiesEnum from "../../enums/cities.enum.js";

export default interface UserRequestDto {
    name: string;
    surname: string;
    email: string;
    password: string;
    city: CitiesEnum;
    phone: string,
    location: string[];
}
