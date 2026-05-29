import type { OrderItemRequestDto } from "../dtos/order/order-request.dto.js";
import type OrderRequestDto from "../dtos/order/order-request.dto.js";
import OrderStatesEnum from "../enums/order-states.enum.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toOrderResponseDto } from "../mapper/order.mapper.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";
import type JwtPayload from "../types/jwt-payload.type.js";
import { checkEmptyArray, getEntityById, checkIsAuthorized, validateEnum } from "../utils/validate.util.js";


export const createOrder = async (data: OrderRequestDto, user: JwtPayload) => {
    const { items, state } = data;
    const userId = user.id;

    checkEmptyArray(items, "Items");
    validateEnum(state, OrderStatesEnum);

    const orderItems = await getOrderItems(items);
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
        buyer: userId,
        items: orderItems,
        totalPrice,
        state
    });

    return await getOrderById(order._id.toString());
}

export const updateOrder = async (orderId: string, data: OrderRequestDto, user: JwtPayload) => {
    const { items, state } = data;
    const userId = user.id;

    checkEmptyArray(items, "Items");
    validateEnum(state, OrderStatesEnum);
    
    const order = await getEntityById(orderId, Order);    

    checkIsAuthorized(order.buyer.toString(), user);

    const orderItems = await getOrderItems(items);
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
        buyer: userId,
        orderItems,
        totalPrice,
        state
    }

    Object.assign(order, orderData);
    await order.save();

    return await getOrderById(order._id.toString());
}  

export const deleteOrderById = async (orderId: string, user: JwtPayload) => {
    const order = await getEntityById(orderId, Order);

    checkIsAuthorized(order.seller.toString(), user);    

    await order.deleteOne();

    return true;
}

export const getOrderById = async (orderId: string) => {
    const order = await Order.findById(orderId)
        .populate("buyer")
        .populate({
            path: "items.item",
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


const getOrderItems = async (items: OrderItemRequestDto[]) => {
    const itemIds = items.map(i => i.item);
    const dbItems = await Item.find({
        _id: { $in: itemIds }
    });

    const orderItems = items.map(orderItem => {
        const dbItem = dbItems.find(
            i => i._id.toString() === orderItem.item
        );

        return {
            item: dbItem!._id,
            quantity: orderItem.quantity,
            price: dbItem!.price
        };
    });

    return orderItems;
}