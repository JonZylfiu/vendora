import mongoose from "mongoose";
import OrderStatesEnum  from "../enums/order-states.enum.js";
import type IOrder from "./interfaces/IOrder.interface.js";
const { Schema } = mongoose;


const OrderSchema = new Schema<IOrder>({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    item: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        price: {
            type: Number,
            required: true,
            min: 0
        }
    },
    totalPrice: {
        type: Number,
        min: 0,
        required: true
    },
    state: {
        type: String,
        enum: Object.values(OrderStatesEnum),
        default: OrderStatesEnum.PENDING
    }
}, {
    timestamps: true
})


const Order = mongoose.model("Order", OrderSchema);

export default Order;