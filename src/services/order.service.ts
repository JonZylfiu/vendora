import type { OrderRequestDto } from "../dtos/order/order-request.dto.js";
import OrderStatesEnum from "../enums/order-states.enum.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toOrderResponseDto } from "../mapper/order.mapper.js";
import type IOrder from "../models/interfaces/IOrder.interface.js";
import type IItem from "../models/interfaces/IITem.interface.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";
import type JwtPayload from "../types/jwt-payload.type.js";
import { checkIsAuthorized, getEntityById } from "../utils/validate.util.js";
import { restoreItem, soldItem } from "./item.service.js";
import { getHighestBidByItemId } from "./bid.service.js";
import type IBid from "../models/interfaces/IBid.interface.js";
import ItemStatesEnum from "../enums/item-states.enum.js";


export const createOrder = async (data: OrderRequestDto, user: JwtPayload) => {
    const { item } = data;

    if(!item) {
        throw new BadRequestError({
            message: "Order must contain an item"
        })
    }

    const orderItem = await getEntityById(item, Item);

    const _soldItem = await soldItem(item, user);

    const highestBid: IBid | null = await getHighestBidByItemId(orderItem.id.toString());
    
    if(highestBid == null) {
        throw new BadRequestError({
            message: `Item with id ${item} does not have a bidder!`
        })
    }

    const { amount: price, bidderId } = highestBid;
    
    const order = await Order.create({
        seller: orderItem.seller,
        buyer: bidderId,
        item: _soldItem.id,
        price
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
    const order = await Order.findById(orderId).populate("item");

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
        .populate("seller")
        .populate("item");

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
        .populate("seller")
        .populate("item");

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
        .populate("seller")
        .populate("item");

    return orders.map(order => toOrderResponseDto(order));
}

export const getOrderByItemId = async (id: string): Promise<IOrder | null> => {
    const order = await Order.findOne({ _id: id });

    return order;
}

const cancelOrder = async (orderId: string, user: JwtPayload) => {
    const order: IOrder = await changeOrderState(orderId, OrderStatesEnum.CANCELLED, user);
    
    await restoreItem(order.item.toString(), user);
    
    return true;
}

const acceptOrder = async (orderId: string, user: JwtPayload) => {    
    const order = await changeOrderState(orderId, OrderStatesEnum.CONFIRMED, user);

    await soldItem(order.item.toString(), user);

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
    const order = await Order.findById(orderId).populate("item");  
    
    if(!order) {
        throw new BadRequestError({
            message: `Order with id ${orderId} does not exist!`
        })
    }


    const isCancel = state === OrderStatesEnum.CANCELLED;
    const isAccept = state === OrderStatesEnum.CONFIRMED;
    const isDeliver = state === OrderStatesEnum.DELIVERED;
    const isShip = state === OrderStatesEnum.SHIPPED;

    const isCancelAuthorized = isCancel && (order.buyer.toString() === user.id || order.seller.toString() === user.id);
    const isAcceptAuthorized = isAccept && order.seller.toString() === user.id;
    const isDeliverAuthorized = isDeliver && order.buyer.toString() === user.id;
    const isShipAuthorized = isShip && order.seller.toString() === user.id;

    if(!isCancelAuthorized && !isAcceptAuthorized && !isDeliverAuthorized && !isShipAuthorized) {
        throw new BadRequestError({
            message: "You are not authorized to change the status of this order!"
        })
    }

    const validStateTransitions = {
        [OrderStatesEnum.CONFIRMED]: [OrderStatesEnum.SHIPPED, OrderStatesEnum.CANCELLED],
        [OrderStatesEnum.SHIPPED]: [OrderStatesEnum.DELIVERED, OrderStatesEnum.CANCELLED],
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

    const updatedOrder = await Order.findById(orderId).populate("item");
    
    if(!updatedOrder) {
        throw new BadRequestError({
            message: `Order with id ${orderId} does not exist!`
        })
    }

    return updatedOrder;
}
