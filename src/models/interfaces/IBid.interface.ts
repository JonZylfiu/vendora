import type mongoose from "mongoose";

export default interface IBid {
    _id: mongoose.Types.ObjectId;
    itemId: mongoose.Types.ObjectId;
    bidderId: mongoose.Types.ObjectId;
    amount: number;
    highestBid: boolean;

    createdAt: Date;
}