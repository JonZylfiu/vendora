import mongoose from "mongoose";
import { notificationTypes } from "../enums/notificationTypes.js";
const { Schema } = mongoose;


const NotificationSchema = new Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: notificationTypes,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

NotificationSchema.index({ receiver: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;