import type ItemRequestDto from "../dtos/item/item-request.dto.js"
import Item from "../models/item.model.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toItemResponseDto } from "../mapper/item.mapper.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import { checkIsAuthorized, getEntityById, validateEnum } from "../utils/validate.util.js";
import ItemCategoriesEnum from "../enums/item-categories.enum.js";
import type UserJwtPayload from "../types/jwt-payload.type.js";
import type IUser from "../models/interfaces/IUser.interface.js";
import redisClient from "../config/redis.config.js";


export const createItemService = async (data: ItemRequestDto, user: UserJwtPayload) => {
    validateEnum(data.category, ItemCategoriesEnum);

    const item = await Item.create({
        ...data,
        state: ItemStatesEnum.AVAILABLE,
        seller: user.id
    });


    return await getItemByIdService(item.id);
}

export const updateItemService = async (id: string, data: ItemRequestDto, user: UserJwtPayload) => {
    // needs to be in middleware
    if(data.category != undefined) {
        validateEnum(data.category, ItemCategoriesEnum);
    }

    const item = await getEntityById(id, Item);

    checkIsAuthorized(item.seller.toString(), user);

    Object.assign(item, {
        ...data,
        seller: user.id
    });

    await item.save();

    return await getItemByIdService(id);
}

export const changeItemStateService = async(id: string, state: ItemStatesEnum, user: UserJwtPayload) => {
    switch (state) {
        case ItemStatesEnum.ARCHIVED:
            return await archiveItem(id, user);

        case ItemStatesEnum.AVAILABLE:
            return await restoreItem(id, user);

        case ItemStatesEnum.SOLD:
            return await soldItemService(id, user);
    }
}

export const soldItemService = async (id: string, user: UserJwtPayload) => {
    const item = await getEntityById(id, Item);

    if(item.state !== ItemStatesEnum.AVAILABLE) {
        throw new BadRequestError({
            message: "Item is not available!"
        })
    }

    return await updateItemState(id, ItemStatesEnum.SOLD, user);
}

const archiveItem = async (id: string, user: UserJwtPayload) => {
    return await updateItemState(id, ItemStatesEnum.ARCHIVED, user);
}

const restoreItem = async (id: string, user: UserJwtPayload) => {
    const item = await getEntityById(id, Item);

    if(item.state !== ItemStatesEnum.ARCHIVED) {
        throw new BadRequestError({
            message: "Item is not archived!"
        })
    }

    await updateItemState(id, ItemStatesEnum.AVAILABLE, user);
}

export const deleteItemService = async (id: string, user: UserJwtPayload) => {
    const item = await getEntityById(id, Item);

    checkIsAuthorized(item.seller.toString(), user);

    await item.deleteOne();

    return true;
}

export const getItemByIdService = async (id: string) => {
    const item = await getEntityById(id, Item);

    const res = await item.populate("seller");

    return toItemResponseDto(res);
}

export const getAllItemsService = async (filters: any) => {
    const { category, city, search, state, page = 1, limit = 10 } = filters;

    // pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(30, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    // add querys that are requested from client
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

    // get just the number of documents for faster response
    const totalCount = await Item.countDocuments(query);

    let items = await Item.find(query)
        .populate("seller")
        .skip(offset)
        .limit(limitNum);


    // we check the location of item by seller's location
    if (city) {
        items = items.filter(item => {
            const seller = item.seller as unknown as IUser;
            return seller.city === city;
        });
    }

    const data = items.map(item => toItemResponseDto(item));

    //store data to redis
    await redisClient.set("items", JSON.stringify(data));

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

// function for updating item states
const updateItemState = async (id: string, state: ItemStatesEnum, user: UserJwtPayload) => {
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

    return await getItemByIdService(id);
}
