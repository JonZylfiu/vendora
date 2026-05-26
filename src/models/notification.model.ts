import mongoose from "mongoose";
import NotificationTypesEnum from "../enums/notification-types.enum.js";
import type INotification from "./interfaces/INotification.interface.js";
const { Schema } = mongoose;


const NotificationSchema = new Schema<INotification>({
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
        enum: Object.values(NotificationTypesEnum),
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