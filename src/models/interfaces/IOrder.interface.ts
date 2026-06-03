import type mongoose from "mongoose";
import type OrderStatesEnum from "../../enums/order-states.enum.js";


export default interface IOrder {
    _id: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    item: mongoose.Types.ObjectId;
    price: number;
    state: OrderStatesEnum;

    createdAt?: Date;
    updatedAt?: Date;
}