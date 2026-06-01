import type { OrderItemRequestDto, OrderRequestDto } from "../dtos/order/order-request.dto.js";
import OrderStatesEnum from "../enums/order-states.enum.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toOrderResponseDto } from "../mapper/order.mapper.js";
import type IOrder from "../models/interfaces/IOrder.interface.js";
import type IItem from "../models/interfaces/IITem.interface.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";
import type JwtPayload from "../types/jwt-payload.type.js";
import { getEntityById, checkIsAuthorized } from "../utils/validate.util.js";
import { restoreItem, soldItem } from "./item.service.js";


export const createOrder = async (data: OrderRequestDto, user: JwtPayload) => {
    const { item } = data;

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

    const totalPrice = orderItem.price * orderItem.quantity;

    const order = await Order.create({
        buyer: user.id,
        item: orderItem,
        totalPrice,
        state: OrderStatesEnum.PENDING
    });

    return await getOrderById(order.id.toString());
}

export const cancelOrder = async (orderId: string, user: JwtPayload) => {
    const order: IOrder = await changeOrderState(orderId, OrderStatesEnum.CANCELLED, user);
    
    await restoreItem(order.item.id.toString(), order.item.quantity, user);
    
    return true;
}

export const acceptOrder = async (orderId: string, user: JwtPayload) => {    
    const order = await Order.findById(orderId).populate("item.id");
    
    if(!order) {
        throw new BadRequestError({
            message: `Order with id ${orderId} does not exist!`
        })
    }

    if(order.state !== OrderStatesEnum.PENDING) {
        throw new BadRequestError({
            message: "Only pending orders can be accepted!"
        });
    }

    const item = order.item.id as unknown as IItem;

    checkIsAuthorized(item.seller.toString(), user);

    await Order.updateOne(
    {
        _id: order._id
    },
    {
        state: OrderStatesEnum.CONFIRMED
    });

    await soldItem(item._id.toString(), order.item.quantity, user);

    return true;
}

export const deliveredOrder = async (orderId: string, user: JwtPayload) => {
    await changeOrderState(orderId, OrderStatesEnum.DELIVERED, user);

    return true;
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
        .populate({
            path: "item.id",
            populate: {
                path: "seller"
            }
        });

    if(!order) {
        throw new BadRequestError({
            message: `Order with id ${orderId} does not exist!`
        })
    }

    return toOrderResponseDto(order);
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
        quantity: item.quantity,
        price: dbItem!.price
    };
}

const changeOrderState = async (orderId: string, state: OrderStatesEnum, user: JwtPayload) => {
    const order: IOrder = await getEntityById(orderId, Order);   

    checkIsAuthorized(order.buyer.toString(), user);

    await Order.updateOne(
    {
        _id: order._id
    },
    {
        state
    });

    return order;
}