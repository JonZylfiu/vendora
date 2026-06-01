import mongoose from "mongoose";
import type IItem from "../models/interfaces/IITem.interface.js";
import type IUser from "../models/interfaces/IUser.interface.js";

export const toItemResponseDto = (item: IItem) => {
    const seller = item.seller as unknown as IUser;
    
    const { _id, images, title, description, price, quantity, state, category, tags, createdAt } = item;
    
    return {
        id: _id,
        sellerFullName: `${seller.name} ${seller.surname}`,
        sellerPhone: seller.phone,
        sellerCity: seller.city,
        images,
        title,
        description,
        price,
        quantity,
        state,
        category,
        tags,
        createdAt
    }
}