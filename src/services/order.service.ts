import type { OrderItemRequestDto, OrderRequestDto } from "../dtos/order/order-request.dto.js";
import OrderStatesEnum from "../enums/order-states.enum.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toOrderResponseDto } from "../mapper/order.mapper.js";
import type IOrder from "../models/interfaces/IOrder.interface.js";
import type IItem from "../models/interfaces/IITem.interface.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";
import type JwtPayload from "../types/jwt-payload.type.js";
import { checkIsAuthorized } from "../utils/validate.util.js";
import { restoreItem, soldItem } from "./item.service.js";


export const createOrder = async (data: OrderRequestDto, user: JwtPayload) => {
    const { item, bidAmount } = data;

    if(!item.id) {
        throw new BadRequestError({
            message: "Order must contain an item"
        })
    }

    const orderItem = await getOrderItem(item);

    if(!orderItem) {
        throw new BadRequestError({
            message: `Item with id ${item.id} does not exist!`
        })
    }

    const totalPrice = orderItem.price * orderItem.quantity + (bidAmount || 0);

    const order = await Order.create({
        seller: orderItem.seller,
        buyer: user.id,
        item: orderItem,
        totalPrice,
        bidAmount: bidAmount
    });

    return await getOrderById(order.id.toString());
}

export const updateOrderState = async (orderId: string, status: string, user: JwtPayload) => {
    switch(status) {
        case OrderStatesEnum.CANCELLED:
            return await cancelOrder(orderId, user);
        case OrderStatesEnum.CONFIRMED:
            return await acceptOrder(orderId, user);
        case OrderStatesEnum.DELIVERED:
            return await deliveredOrder(orderId, user);
        case OrderStatesEnum.SHIPPED:
            return await shipOrder(orderId, user);
        default:
            throw new BadRequestError({
                message: `Invalid order status: ${status}`
            });
    }
}

export const deleteOrderById = async (orderId: string, user: JwtPayload) => {
    const order = await Order.findById(orderId).populate("item.id");

    if(!order) {
        throw new BadRequestError({
            message: `Order with id ${orderId} does not exist!`
        })
    }

    const item = order.item.id as unknown as IItem;

    checkIsAuthorized(item.seller.toString(), user);    

    await order.deleteOne();

    return true;
}

export const getOrderById = async (orderId: string) => {
    const order = await Order.findById(orderId)
        .populate("buyer")
        .populate("seller");

    if(!order) {
        throw new BadRequestError({
            message: `Order with id ${orderId} does not exist!`
        })
    }

    return toOrderResponseDto(order);
}

export const getAllOrders = async (filter: any) => {
    const { status } = filter;

    if(status) {
        filter.state = status;
    }

    const orders = await Order.find(filter)
        .populate("buyer")
        .populate("seller");

    return orders.map(order => toOrderResponseDto(order));
}

export const getMyOrders = async (user: JwtPayload, filter: any) => {
    const { status } = filter;

    if(status) {
        filter.state = status;
    }

    const orders = await Order.find({
        ...filter,
        buyer: user.id
    })
        .populate("buyer")
        .populate("seller");

    return orders.map(order => toOrderResponseDto(order));
}


const getOrderItem = async (item: OrderItemRequestDto) => {
    const dbItem = await Item.findById(item.id);

    if(!dbItem) {
        throw new BadRequestError({
            message: `Item with id ${item.id} does not exist!`
        })
    }

    return {
        id: dbItem!._id,
        seller: dbItem!.seller,
        quantity: item.quantity,
        price: dbItem!.price
    };
}

const cancelOrder = async (orderId: string, user: JwtPayload) => {
    const order: IOrder = await changeOrderState(orderId, OrderStatesEnum.CANCELLED, user);
    
    await restoreItem(order.item.id.toString(), order.item.quantity, user);
    
    return true;
}

const acceptOrder = async (orderId: string, user: JwtPayload) => {    
    const order = await changeOrderState(orderId, OrderStatesEnum.CONFIRMED, user);

    await soldItem(order.item.id.toString(), order.item.quantity, user);

    return true;
}

const shipOrder = async (orderId: string, user: JwtPayload) => {    
    await changeOrderState(orderId, OrderStatesEnum.SHIPPED, user);

    return true;
}

const deliveredOrder = async (orderId: string, user: JwtPayload) => {
    await changeOrderState(orderId, OrderStatesEnum.DELIVERED, user);

    return true;
}

const changeOrderState = async (orderId: string, state: OrderStatesEnum, user: JwtPayload) => {
    const order = await Order.findById(orderId).populate("item.id");  
    
    if(!order) {
        throw new BadRequestError({
            message: `Order with id ${orderId} does not exist!`
        })
    }

    const cancelAuthorized = state === OrderStatesEnum.CANCELLED && order.buyer.toString() !== user.id && order.seller.toString() !== user.id;
    const acceptAuthorized = state === OrderStatesEnum.CONFIRMED && order.seller.toString() !== user.id;
    const deliveredAuthorized = state === OrderStatesEnum.DELIVERED && order.buyer.toString() !== user.id;

    if(!cancelAuthorized && !acceptAuthorized && !deliveredAuthorized) {
        throw new BadRequestError({
            message: "You are not authorized to change the status of this order!"
        })
    }

    const validStateTransitions = {
        [OrderStatesEnum.CONFIRMED]: [OrderStatesEnum.DELIVERED, OrderStatesEnum.CANCELLED],
        [OrderStatesEnum.SHIPPED]: [OrderStatesEnum.DELIVERED],
        [OrderStatesEnum.DELIVERED]: [] as OrderStatesEnum[],
        [OrderStatesEnum.CANCELLED]: [] as OrderStatesEnum[]
    };

    if(!validStateTransitions[order.state].includes(state)) {
        throw new BadRequestError({
            message: `Invalid order state transition from ${order.state} to ${state}!`
        })
    }

    await Order.updateOne(
    {
        _id: order._id
    },
    {
        state
    });

    return order;
}