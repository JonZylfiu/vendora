import type ItemCategoriesEnum from "../../enums/item-categories.enum.js";
import type ItemStatesEnum from "../../enums/item-states.enum.js";

export default interface ItemRequestDto {
    seller: string;
    images: string[];
    title: string;
    description: string;
    quantity: number;
    price: number;
    category: ItemCategoriesEnum;
    tags: string[];   
}