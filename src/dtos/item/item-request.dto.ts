import type ItemCategoriesEnum from "../../enums/item-categories.enum.js";

export default interface ItemRequestDto {
    seller: string;
    images: string[];
    title: string;
    description: string;
    startingPrice: number;
    category: ItemCategoriesEnum;
    tags: string[];   
}