import type ItemRequestDto from "../dtos/item/item-request.dto.js"
import Item from "../models/item.model.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toItemResponseDto } from "../mapper/item.mapper.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import { checkIsAuthorized, getEntityById, validateEnum } from "../utils/validate.util.js";
import ItemCategoriesEnum from "../enums/item-categories.enum.js";
import type JwtPayload from "../types/jwt-payload.type.js";
import type IUser from "../models/interfaces/IUser.interface.js";


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

export const getAllItems = async (filters: any) => {
    const { category, city, search, state, page = 1, limit = 10 } = filters;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(30, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    let query: any = {};

    if (category) {
        query.category = category;
    }

    if (state) {
        query.state = state;
    } else {
        query.state = ItemStatesEnum.AVAILABLE;
    }
    
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const totalCount = await Item.countDocuments(query);

    let items = await Item.find(query)
        .populate("seller")
        .skip(offset)
        .limit(limitNum);

    if (city) {
        items = items.filter(item => {
            const seller = item.seller as unknown as IUser;
            return seller.city === city;
        });
    }

    const data = items.map(item => toItemResponseDto(item));

    return {
        data,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalCount,
            pages: Math.ceil(totalCount / limitNum)
        }
    };
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
