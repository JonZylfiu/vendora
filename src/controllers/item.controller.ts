import type { Request, Response } from "express";
import type ItemRequestDto from "../dtos/item/item-request.dto.js";
import { createItem, updateItem, deleteItem as deleteItemById, getItemById, getAllItems, changeItemState } from "../services/item.service.js";
import { response } from "../utils/api-response.util.js";
import type ItemStatesEnum from "../enums/item-states.enum.js";



export const create = async (req: Request<{}, {}, ItemRequestDto>, res: Response) => {
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path): [];    
    const itemData = {
        ...req.body,
        images
    }

    const item = await createItem(itemData, req.user);

    return response(res, 201, "Item is created successfully!", item);
}


// fix image update
export const update = async (req: Request<{id: string}, {}, ItemRequestDto>, res: Response) => {
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path): [];    
    const itemData = {
        ...req.body,
        ...(images.length > 0 && { images })
    }

    const item = await updateItem(req.params.id, itemData, req.user);
    return response(res, 200, "Item is updated successfully!", item);
}

export const changeState = async (req: Request<{id: string}, {}, {}, {state: ItemStatesEnum}>, res: Response) => {
    const item = await changeItemState(req.params.id, req.query.state, req.user);

    return response(res, 200, "Item state is updated successfully!", item);
}


export const deleteItem = async (req: Request<{id: string}>, res: Response) => {
    await deleteItemById(req.params.id, req.user);

    return response(res, 200, "Item is deleted successfully!", null);
}

export const getById = async (req: Request<{id: string}>, res: Response) => {
    const item = await getItemById(req.params.id);

    return response(res, 200, null, item);
}

export const getAll = async (req: Request, res: Response) => {
    const items = await getAllItems(req.query);

    return response(res, 200, null, items);
}

