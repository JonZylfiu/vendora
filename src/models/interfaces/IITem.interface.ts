import type mongoose from "mongoose";
import type ItemStatesEnum from "../../enums/item-states.enum.js";

export default interface IItem {
    seller: mongoose.Types.ObjectId;
    images: string[];
    title: string;
    description: string;
    price: number;
    state: ItemStatesEnum;
    category: mongoose.Types.ObjectId;
    tags: string[];

    createdAt?: Date;
    updatedAt?: Date;
}