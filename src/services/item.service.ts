import type ItemRequestDto from "../dtos/item/item-request.dto.js"
import Item from "../models/item.model.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toItemResponseDto } from "../mapper/item.mapper.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import { validateEnum } from "../utils/validate.util.js";
import ItemCategoriesEnum from "../enums/item-categories.enum.js";


export const createItem = async (data: ItemRequestDto) => {    
    validateEnum(data.state, ItemStatesEnum);
    validateEnum(data.category, ItemCategoriesEnum);

    const item = await Item.create(data); 
    const res = await item.populate("seller");

    return toItemResponseDto(res);
}


export const updateItem = async (id: string, data: ItemRequestDto) => {
    
    const updatedItem = await Item.findByIdAndUpdate(id, data, {new: true, runValidators: true}); 

    if(!updatedItem) {
        throw new BadRequestError({
            message: `Item with id ${id} does not exist!`
        });
    }

    const res = await updatedItem.populate("seller");

    return toItemResponseDto(res);
}


export const deleteItem = async (id: string) => {
    const deleted = await Item.findByIdAndDelete(id);

    if(!deleted) {
        throw new BadRequestError({
            message: `Item with id ${id} does not exist!`
        });
    }

    return true;
}

export const getItemById = async (id: string) => {
    const item = await Item.findById(id);

    if(!item) {
        throw new BadRequestError({
            message: `Item with id ${id} does not exist!`
        });
    }

    const res = await item.populate("seller");

    return toItemResponseDto(res);
}

