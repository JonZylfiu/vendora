import type mongoose from "mongoose";
import type OrderStatesEnum from "../../enums/order-states.enum.js";

export interface IOrderItem {
    id: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export default interface IOrder {
    _id: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    item: IOrderItem;
    totalPrice: number;
    bidAmount: number;
    state: OrderStatesEnum;

    createdAt?: Date;
    updatedAt?: Date;
}