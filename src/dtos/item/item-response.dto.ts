import type CitiesEnum from "../../enums/cities.enum.js";
import type ItemStatesEnum from "../../enums/item-states.enum.js";


export default interface ItemResponseDto {
    id: number;
    sellerName: string;
    sellerSurname: string;
    sellerPhone: number;
    sellerCity: CitiesEnum;
    images: string[];
    title: string;
    description: string;
    price: number;
    state: ItemStatesEnum;
    category: string;
    tags: string[];
    createdAt: string
}