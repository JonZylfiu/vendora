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
import { createNotification } from "./notification.service.js";
import NotificationTypesEnum from "../enums/notification-types.enum.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";


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

    if(highestBid) {
        await createNotification({ 
            receiver: highestBid.bidderId.toString(),
            message: `Your bid at item with id: ${item} is accepted!`,
            type: NotificationTypesEnum.BID_ACCEPTED 
        });
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
        case OrderStatesEnum.RECEIVED:
            return await receivedOrder(orderId, user);
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

    const item = order.item as unknown as IItem;

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


// admin
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


export const getUserOrders = async (user: JwtPayload, filter: any) => {
    // const { state } = filter;
    
    // if(state) {
    //     filter.state = state;
    // }

    const orders = await Order.find({
        // ...filter,
        buyer: user.id
    })
        .populate("buyer")
        .populate("seller")
        .populate("item");

    return orders.map(order => toOrderResponseDto(order));
}

export const getOrderByItemId = async (id: string, user: JwtPayload): Promise<IOrder | null> => {
    const order = await Order.findById(id);

    if(!order) {
        return null;
    }

    if(order.seller.toString() != user.id && order.buyer.toString() != user.id) {
        throw new NotAuthorizedError({
            message: "You're not authorized!"
        })
    }

    return order;
}

const cancelOrder = async (orderId: string, user: JwtPayload) => {
    const order: IOrder = await changeOrderState(orderId, OrderStatesEnum.CANCELLED, user);

    await restoreItem(order.item.toString(), user);
    await createNotification({
        receiver: order.buyer.toString(),
        message: `Order with id: ${order._id} is cancelled!`,
        type: NotificationTypesEnum.ORDER_CANCELLED
    })

    return true;
}

const acceptOrder = async (orderId: string, user: JwtPayload) => {    
    const order = await changeOrderState(orderId, OrderStatesEnum.CONFIRMED, user);

    await soldItem(order.item.toString(), user);

    return true;
}

const shipOrder = async (orderId: string, user: JwtPayload) => {    
    const order = await changeOrderState(orderId, OrderStatesEnum.SHIPPED, user);
    
    await createNotification({
        receiver: order.buyer.toString(),
        message: `Order with id: ${order._id} is shipped`,
        type: NotificationTypesEnum.ORDER_SHIPPED
    })

    return true;
}

const receivedOrder = async (orderId: string, user: JwtPayload) => {
    const order = await changeOrderState(orderId, OrderStatesEnum.RECEIVED, user);

    await createNotification({
        receiver: order.seller.toString(),
        message: `Order with id: ${order._id} is delivered`,
        type: NotificationTypesEnum.ORDER_RECEIVED
    })

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
    const isRecieve = state === OrderStatesEnum.RECEIVED;
    const isShip = state === OrderStatesEnum.SHIPPED;

    const isCancelAuthorized = isCancel && (order.seller.toString() == user.id);
    const isRecieveAuthorized = isRecieve && order.buyer.toString() == user.id;
    const isShipAuthorized = isShip && order.seller.toString() == user.id;

    if(!isCancelAuthorized && !isRecieveAuthorized && !isShipAuthorized) {
        throw new BadRequestError({
            message: "You are not authorized to change the status of this order!"
        })
    }

    const validStateTransitions = {
        [OrderStatesEnum.CONFIRMED]: [OrderStatesEnum.SHIPPED, OrderStatesEnum.CANCELLED],
        [OrderStatesEnum.SHIPPED]: [OrderStatesEnum.RECEIVED, OrderStatesEnum.CANCELLED],
        [OrderStatesEnum.RECEIVED]: [] as OrderStatesEnum[],
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
