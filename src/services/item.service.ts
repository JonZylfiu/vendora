import type ItemRequestDto from "../dtos/item/item-request.dto.js"
import Item from "../models/item.model.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toItemResponseDto } from "../mapper/item.mapper.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import { checkIsAuthorized, getEntityById, validateEnum } from "../utils/validate.util.js";
import ItemCategoriesEnum from "../enums/item-categories.enum.js";
import type JwtPayload from "../types/jwt-payload.type.js";


export const createItem = async (data: ItemRequestDto, user: JwtPayload) => {    
    validateEnum(data.category, ItemCategoriesEnum);

    const item = await Item.create({
        ...data,
        state: ItemStatesEnum.AVAILABLE,
        seller: user.id
    });
    

    return await getItemById(item.id);
}

export const updateItem = async (id: string, data: ItemRequestDto, user: JwtPayload) => {
    validateEnum(data.category, ItemCategoriesEnum);
    
    const item = await getEntityById(id, Item);

    checkIsAuthorized(item.seller.toString(), user);

    Object.assign(item, {
        ...data,
        seller: user.id
    });
    
    await item.save();
    
    return await getItemById(id);
}

export const archiveItem = async (id: string, user: JwtPayload) => {
    return await updateItemState(id, ItemStatesEnum.ARCHIVED, user);
}

export const soldItem = async (id: string, user: JwtPayload) => {
    const item = await getEntityById(id, Item);
    
    if(item.state !== ItemStatesEnum.AVAILABLE) {
        throw new BadRequestError({
            message: "Item is not available!"
        })
    }

    return await updateItemState(id, ItemStatesEnum.SOLD, user);
}

export const restoreItem = async (id: string, user: JwtPayload) => {
    const item = await getEntityById(id, Item);

    if(item.state !== ItemStatesEnum.ARCHIVED) {
        throw new BadRequestError({
            message: "Item is not archived!"
        })
    }

    await updateItemState(id, ItemStatesEnum.AVAILABLE, user);
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

const updateItemState = async (id: string, state: ItemStatesEnum, user: JwtPayload) => {
    const item = await getEntityById(id, Item);

    checkIsAuthorized(item.seller.toString(), user);

    await Item.updateOne(
        {
            _id: id
        },
        {
            state
        }
    )

    return await getItemById(id);
}