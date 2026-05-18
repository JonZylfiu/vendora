import mongoose from "mongoose";
import orderStates  from "../enums/orderStates.js";
const { Schema } = mongoose;


const OrderSchema = new Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [{
            item: {
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
        }],
        validate: {
            validator: v => v.length > 0,
            message: 'At least one item is required'
        }
    },
    total_price: {
        type: Number,
        min: 0,
        required: true
    },
    state: {
        type: String,
        enum: orderStates,
        default: "PENDING"
    }
}, {
    timestamps: true
})


const Order = new Schema("Order", OrderSchema);

export default Order;