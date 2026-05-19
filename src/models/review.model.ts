import mongoose from "mongoose";
const { Schema } = mongoose;


const ReviewSchema = new Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reviewed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        maxLength: 150,
        required: true
    }
}, {
    timestamps: true
})

ReviewSchema.index(
    { reviewer: 1, order: 1 },
    { unique: true }
);


const Review = mongoose.model("Review", ReviewSchema);
export default Review;