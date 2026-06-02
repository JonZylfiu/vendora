import mongoose from "mongoose";
const { Schema } = mongoose;
import ItemStatesEnum from "../enums/item-states.enum.js";
import type IItem from "./interfaces/IITem.interface.js";
import ItemCategoriesEnum from "../enums/item-categories.enum.js";


const ItemSchema = new Schema<IItem>({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: {
        type: [String],
        validate: {
            validator: (v: String[]) => v.length > 0,
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
    state: {
        type: String,
        enum: Object.values(ItemStatesEnum),
        default: ItemStatesEnum.AVAILABLE
    },
    category: {
        type: String,
        enum: Object.values(ItemCategoriesEnum),
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