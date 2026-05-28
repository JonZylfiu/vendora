import type mongoose from "mongoose";
import type ItemStatesEnum from "../../enums/item-states.enum.js";
import type ItemCategoriesEnum from "../../enums/item-categories.enum.js";

export default interface IItem {
    _id: number,
    seller: mongoose.Types.ObjectId;
    images: string[];
    title: string;
    description: string;
    price: number;
    state: ItemStatesEnum;
    category: ItemCategoriesEnum;
    tags: string[];

    createdAt?: Date;
    updatedAt?: Date;
}