import type { Request, Response } from "express";
import type ItemRequestDto from "../dtos/item/item-request.dto.js";
import { createItem, updateItem, deleteItem as deleteItemById, getItemById } from "../services/item.service.js";
import { response } from "../utils/api-response.util.js";



export const create = async (req: Request<{}, {}, ItemRequestDto>, res: Response) => {

    const item = await createItem(req.body, req.user);

    return response(item, "Item is created successfully!", 201, res);
}

export const update = async (req: Request<{id: string}, {}, ItemRequestDto>, res: Response) => {

    const item = await updateItem(req.params.id, req.body, req.user);
    return response(item, "Item is updated successfully!", 200, res);
}


export const deleteItem = async (req: Request<{id: string}>, res: Response) => {
    await deleteItemById(req.params.id, req.user);

    return response(null, "Item is deleted successfully!", 200, res);
}

export const getById = async (req: Request<{id: string}>, res: Response) => {
    const item = await getItemById(req.params.id);

    return response(item, null, 200, res);    
}

