import mongoose from "mongoose";
const { Schema } = mongoose;
import itemStates from "../enums/itemStates.js";


const ItemSchema = new Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: {
        type: [String],
        validate: {
            validator: v => v.length > 0,
            message: "At least one image is required"
        }   
    },
    title: {
        type: String,
        required: true,
        maxLength: [70, "Item title max length is 70 chars"]
    },
    description: {
        type: String,
        required: true,
        maxLength: [300, "Item description max length is 300 chars"]
    },
    price: {
        type: Number,
        required: [true, "Item price required"],
        min: 0
    },
    state: {
        type: String,
        enum: itemStates,
        default: "AVAILABLE"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

ItemSchema.index({
    category: 1
})

ItemSchema.index({ 
    title: 'text',
    description: 'text'
})


const Item = mongoose.model("Item", ItemSchema);

export default Item;