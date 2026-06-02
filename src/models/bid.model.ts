import { Schema, model } from "mongoose";
import type IBid from "./interfaces/IBid.interface.js";

const bidSchema = new Schema<IBid>({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    }, 
    itemId: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    bidderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Bid = model<IBid>("Bid", bidSchema);

export default Bid;