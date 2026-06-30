import type { OrderRequestDto } from "../dtos/order/order-request.dto.js";
import OrderStatesEnum from "../enums/order-states.enum.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toOrderResponseDto } from "../mapper/order.mapper.js";
import type IOrder from "../models/interfaces/IOrder.interface.js";
import type IItem from "../models/interfaces/IITem.interface.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";
import type UserJwtPayload from "../types/jwt-payload.type.js";
import { checkIsAuthorized, getEntityById } from "../utils/validate.util.js";
import { soldItemService } from "./item.service.js";
import { getHighestBidByItemIdService } from "./bid.service.js";
import type IBid from "../models/interfaces/IBid.interface.js";
import { createNotificationService } from "./notification.service.js";
import NotificationTypesEnum from "../enums/notification-types.enum.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import notificationEmitter from "../events/notification.event.js";


export const createOrderService = async (data: OrderRequestDto, user: UserJwtPayload) => {
    const { item } = data;

    if(!item) {
        throw new BadRequestError({
            message: "Order must contain an item"
        })
    }

    const orderItem = await getEntityById(item, Item);

    const highestBid: IBid | null = await getHighestBidByItemIdService(orderItem.id.toString());

    if(highestBid == null) {
        throw new BadRequestError({
            message: `Item with id ${item} does not have a bidder!`
        })
    }

    const _soldItem = await soldItemService(item, user);

    if(highestBid) {
        await createNotificationService({
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

    return await getOrderByIdService(order.id.toString());
}

export const updateOrderStateService = async (orderId: string, status: string, user: UserJwtPayload) => {
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

export const deleteOrderByIdService = async (orderId: string, user: UserJwtPayload) => {
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

export const getOrderByIdService = async (orderId: string) => {
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
export const getAllOrdersService = async (filter: any) => {
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


export const getUserOrdersService = async (user: UserJwtPayload, filter: any) => {
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

export const getOrderByItemIdService = async (id: string, user?: UserJwtPayload): Promise<IOrder | null> => {
    const order = await Order.findOne({
        item: id
    });

    if(!order) {
        return null;
    }

    if(user && order.seller.toString() != user.id && order.buyer.toString() != user.id) {
        throw new NotAuthorizedError({
            message: "You're not authorized!"
        })
    }

    return order;
}

const cancelOrder = async (orderId: string, user: UserJwtPayload) => {
    const order: IOrder = await changeOrderState(orderId, OrderStatesEnum.CANCELLED, user);

    await Item.updateOne(
        {
            _id: order.item
        },
        {
            state: "AVAILABLE"
        }
    );

    const notificationReceiver = order.buyer.toString();
    notificationEmitter.emit("order-cancelled", notificationReceiver, orderId);

    return true;
}

const acceptOrder = async (orderId: string, user: UserJwtPayload) => {
    const order: IOrder = await changeOrderState(orderId, OrderStatesEnum.CONFIRMED, user);

    await soldItemService(order.item.toString(), user);

    notificationEmitter.emit("bid-accepted", order.buyer, order.item);

    return true;
}

const shipOrder = async (orderId: string, user: UserJwtPayload) => {
    const order = await changeOrderState(orderId, OrderStatesEnum.SHIPPED, user);

    const notificationReceiver = order.buyer.toString();
    notificationEmitter.emit("order-shipped", notificationReceiver, orderId);

    return true;
}

const receivedOrder = async (orderId: string, user: UserJwtPayload) => {
    const order = await changeOrderState(orderId, OrderStatesEnum.RECEIVED, user);

    const notificationReceiver = order.buyer.toString();
    notificationEmitter.emit("order-received", notificationReceiver, orderId);

    return true;
}

const changeOrderState = async (orderId: string, state: OrderStatesEnum, user: UserJwtPayload) => {
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
    const isRecieveAuthorized = isRecieve && (order.buyer.toString() == user.id);
    const isShipAuthorized = isShip && (order.seller.toString() == user.id);

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
