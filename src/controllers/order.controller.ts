import { type Request, type Response } from "express";
import type { OrderRequestDto } from "../dtos/order/order-request.dto.js";
import { createOrderService, deleteOrderByIdService, getOrderByIdService, updateOrderStateService, getUserOrdersService } from "../services/order.service.js";
import { response } from "../utils/api-response.util.js";
import type OrderStatesEnum from "../enums/order-states.enum.js";
import type { OrderResponseDto } from "../dtos/order/order-response.dto.js";



export const createOrderController = async (req: Request<{}, {}, OrderRequestDto>, res: Response) => {
    const data = req.body;
    const order = await createOrderService(data, req.user);

    return response(res, 201, "Order is created successfully", order);
}

export const updateOrderStateController = async (req: Request<{id: string}, {}, {state: OrderStatesEnum}>, res: Response) => {
    const orderId = req.params.id;
    const { state } = req.body;
    await updateOrderStateService(orderId, state, req.user);
    
    return response(res, 200, "Order status is updated successfully", null);
}

export const deleteOrderController = async (req: Request<{id: string}, {}, OrderRequestDto>, res: Response) => {
    const orderId = req.params.id;
    await deleteOrderByIdService(orderId, req.user);

    return response(res, 200, "Order is deleted successfully", null);
}

export const getUserOrdersController = async (req: Request<{id: string}, {}, OrderRequestDto, {filter: string}>, res: Response) => {
    const orders: OrderResponseDto[] = await getUserOrdersService(req.user, req.query.filter);

    return response(res, 200, null, orders);
}

export const getOrderByIdController = async (req: Request<{id: string}>, res: Response) => {
    const orderId = req.params.id;
    const order = await getOrderByIdService(orderId);

    return response(res, 200, null, order);
}
