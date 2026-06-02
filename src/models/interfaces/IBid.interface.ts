import { Schema } from "mongoose";

export default interface IBid {
    _id: Schema.Types.ObjectId;
    itemId: Schema.Types.ObjectId;
    bidderId: Schema.Types.ObjectId;
    amount: number;

    createdAt: Date;
}