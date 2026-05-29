import type mongoose from "mongoose";
import type OrderStatesEnum from "../../enums/order-states.enum.js";

export interface IOrderItem {
    item: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export default interface IOrder {
    _id: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    state: OrderStatesEnum;

    createdAt?: Date;
    updatedAt?: Date;
}