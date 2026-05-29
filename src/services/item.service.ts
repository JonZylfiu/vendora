import type ItemRequestDto from "../dtos/item/item-request.dto.js"
import Item from "../models/item.model.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toItemResponseDto } from "../mapper/item.mapper.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import { checkIsAuthorized, getEntityById, validateEnum } from "../utils/validate.util.js";
import ItemCategoriesEnum from "../enums/item-categories.enum.js";
import type JwtPayload from "../types/jwt-payload.type.js";


export const createItem = async (data: ItemRequestDto) => {    
    validateEnum(data.state, ItemStatesEnum);
    validateEnum(data.category, ItemCategoriesEnum);

    const item = await Item.create(data); 
    const res = await item.populate("seller");

    return toItemResponseDto(res);
}


export const updateItem = async (id: string, data: ItemRequestDto, user: JwtPayload) => {
    validateEnum(data.state, ItemStatesEnum);
    validateEnum(data.category, ItemCategoriesEnum);
    
    const item = await getEntityById(id, Item);

    checkIsAuthorized(item.seller.toString(), user);

    Object.assign(item, data);
    await item.save();
    
    const res = await item.populate("seller");

    return toItemResponseDto(res);
}


export const deleteItem = async (id: string, user: JwtPayload) => {
    const item = await getEntityById(id, Item);

    checkIsAuthorized(item.seller.toString(), user);    

    await item.deleteOne();

    return true;
}

export const getItemById = async (id: string) => {
    const item = await getEntityById(id, Item);

    const res = await item.populate("seller");

    return toItemResponseDto(res);
}

