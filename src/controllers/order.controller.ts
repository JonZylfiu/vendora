import { type Request, type Response } from "express";
import type { OrderRequestDto } from "../dtos/order/order-request.dto.js";
import { createOrder, deleteOrderById, getOrderById, updateOrderState, getUserOrders as userOrders } from "../services/order.service.js";
import { response } from "../utils/api-response.util.js";
import type OrderStatesEnum from "../enums/order-states.enum.js";
import type { OrderResponseDto } from "../dtos/order/order-response.dto.js";



export const create = async (req: Request<{}, {}, OrderRequestDto>, res: Response) => {
    const data = req.body;
    const order = await createOrder(data, req.user);

    return response(order, "Order is created successfully", 201, res);
}

export const updateState = async (req: Request<{id: string}, {}, {state: OrderStatesEnum}>, res: Response) => {
    const orderId = req.params.id;
    const { state } = req.body;
    await updateOrderState(orderId, state, req.user);
    
    return response(null, "Order status is updated successfully", 200, res);
}

export const deleteOrder = async (req: Request<{id: string}, {}, OrderRequestDto>, res: Response) => {
    const orderId = req.params.id;
    await deleteOrderById(orderId, req.user);

    return response(null, "Order is deleted successfully", 200, res);
}

export const getUserOrders = async (req: Request<{id: string}, {}, OrderRequestDto, {filter: string}>, res: Response) => {
    const orders: OrderResponseDto[] = await userOrders(req.user, req.query.filter);

    return response(orders, null, 200, res);
}

export const getById = async (req: Request<{id: string}>, res: Response) => {
    const orderId = req.params.id;
    const order = await getOrderById(orderId);

    return response(order, null, 200, res);
}

export const getAll = async (req: Request<{status?: string}>, res: Response) => {
    // const orders = await getAllOrders(req.query);
    const orders: any[] = [];
    return response(orders, null, 200, res);
}
