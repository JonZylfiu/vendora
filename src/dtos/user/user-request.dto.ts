import type CitiesEnum from "../../enums/cities.enum.js";

export default interface UserRequestDto {
    name: string;
    surname: string;
    email: string;
    password: string;
    age: number;
    city: CitiesEnum;
    phone: string,
    location: number[];
}
