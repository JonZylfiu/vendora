import type mongoose from "mongoose";

export default interface IReview {
    reviewer: mongoose.Types.ObjectId;
    reviewed: mongoose.Types.ObjectId;
    order: mongoose.Types.ObjectId;
    rating: number;
    comment: string;

    createdAt?: Date;
    updatedAt?: Date;
}