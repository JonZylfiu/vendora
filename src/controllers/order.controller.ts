import { type Request, type Response } from "express";
import type OrderRequestDto from "../dtos/order/order-request.dto.js";
import { createOrder, deleteOrderById, getOrderById, updateOrder } from "../services/order.service.js";
import { response } from "../utils/api-response.util.js";



export const create = async (req: Request<{}, {}, OrderRequestDto>, res: Response) => {
    const data = req.body;
    const order = await createOrder(data, req.user);

    return response(order, "Order is created successfully", 201, res);
}

export const update = async (req: Request<{id: string}, {}, OrderRequestDto>, res: Response) => {
    const orderId = req.params.id;
    const data = req.body;
    const order = await updateOrder(orderId, data, req.user);

    return response(order, "Order is updated successfully", 200, res);
}

export const deleteOrder = async (req: Request<{id: string}, {}, OrderRequestDto>, res: Response) => {
    const orderId = req.params.id;
    await deleteOrderById(orderId, req.user);

    return response(null, "Order is deleted successfully", 200, res);
}

export const getById = async (req: Request<{id: string}, {}, OrderRequestDto>, res: Response) => {
    const orderId = req.params.id;
    const order = await getOrderById(orderId);

    return response(order, null, 200, res);
}