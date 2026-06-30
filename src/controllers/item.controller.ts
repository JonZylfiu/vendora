import type { Request, Response } from "express";
import type ItemRequestDto from "../dtos/item/item-request.dto.js";
import { createItemService, updateItemService, deleteItemService, getItemByIdService, getAllItemsService, changeItemStateService } from "../services/item.service.js";
import { response } from "../utils/api-response.util.js";
import type ItemStatesEnum from "../enums/item-states.enum.js";



export const createItemController = async (req: Request<{}, {}, ItemRequestDto>, res: Response) => {
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path): [];    
    const itemData = {
        ...req.body,
        images
    }

    const item = await createItemService(itemData, req.user);

    return response(res, 201, "Item is created successfully!", item);
}


// fix image update
export const updateItemController = async (req: Request<{id: string}, {}, ItemRequestDto>, res: Response) => {
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path): [];    
    const itemData = {
        ...req.body,
        ...(images.length > 0 && { images })
    }

    const item = await updateItemService(req.params.id, itemData, req.user);
    return response(res, 200, "Item is updated successfully!", item);
}

export const changeItemStateController = async (req: Request<{id: string}, {}, {}, {state: ItemStatesEnum}>, res: Response) => {
    const item = await changeItemStateService(req.params.id, req.query.state, req.user);

    return response(res, 200, "Item state is updated successfully!", item);
}


export const deleteItemController = async (req: Request<{id: string}>, res: Response) => {
    await deleteItemService(req.params.id, req.user);

    return response(res, 200, "Item is deleted successfully!", null);
}

export const getItemByIdController = async (req: Request<{id: string}>, res: Response) => {
    const item = await getItemByIdService(req.params.id);

    return response(res, 200, null, item);
}

export const getAllItemsController = async (req: Request, res: Response) => {
    const items = await getAllItemsService(req.query);

    return response(res, 200, null, items);
}

