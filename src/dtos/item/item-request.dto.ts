import type ItemCategoriesEnum from "../../enums/item-categories.enum.js";
import type ItemStatesEnum from "../../enums/item-states.enum.js";

export default interface ItemRequestDto {
    seller: string;
    images: string[];
    title: string;
    description: string;
    price: number;
    state: ItemStatesEnum;
    category: ItemCategoriesEnum;
    tags: string[];   
}