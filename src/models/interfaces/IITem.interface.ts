import type mongoose from "mongoose";
import type ItemStatesEnum from "../../enums/item-states.enum.js";
import type ItemCategoriesEnum from "../../enums/item-categories.enum.js";

export default interface IItem {
    _id: mongoose.Types.ObjectId,
    seller: mongoose.Types.ObjectId;
    images: string[];
    title: string;
    description: string;
    startingPrice: number;
    state: ItemStatesEnum;
    category: ItemCategoriesEnum;
    tags: string[];

    createdAt?: Date;
    updatedAt?: Date;
}