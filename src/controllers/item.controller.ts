import type { Request, Response } from "express";
import type ItemRequestDto from "../dtos/item/item-request.dto.js";
import { createItem, updateItem, deleteItem as deleteItemById, getItemById, restoreItem, soldItem, archiveItem, getAllItems } from "../services/item.service.js";
import { response } from "../utils/api-response.util.js";



export const create = async (req: Request<{}, {}, ItemRequestDto>, res: Response) => {
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path): [];    
    const itemData = {
        ...req.body,
        images
    }

    const item = await createItem(itemData, req.user);

    return response(res, 201, "Item is created successfully!", item);
}

export const update = async (req: Request<{id: string}, {}, ItemRequestDto>, res: Response) => {
    const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path): [];    
    const itemData = {
        ...req.body,
        ...(images.length > 0 && { images })
    }

    const item = await updateItem(req.params.id, itemData, req.user);
    return response(res, 200, "Item is updated successfully!", item);
}

export const restore = async (req: Request<{id: string}>, res: Response) => {
    const item = await restoreItem(req.params.id, req.user);
    return response(res, 200, "Item is restored successfully!", item);
}

export const archive = async (req: Request<{id: string}>, res: Response) => {
    const item = await archiveItem(req.params.id, req.user);
    return response(res, 200, "Item is archived successfully!", item);
}

export const sold = async (req: Request<{id: string}>, res: Response) => {
    const item = await soldItem(req.params.id, req.user);
    return response(res, 200, "Item is sold successfully!", item);
}


export const deleteItem = async (req: Request<{id: string}>, res: Response) => {
    await deleteItemById(req.params.id, req.user);

    return response(res, 200, "Item is deleted successfully!", null);
}

export const getById = async (req: Request<{id: string}>, res: Response) => {
    const item = await getItemById(req.params.id);

    return response(res, 200, null, item);
}

export const getAll = async (req: Request<{}, {}, {}, any>, res: Response) => {
    const items = await getAllItems(req.query);

    return response(res, 200, null, items);
}

