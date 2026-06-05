import type mongoose from "mongoose";
import type NotificationTypesEnum from "../../enums/notification-types.enum.js";

export default interface INotification {
    _id: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    message: string;
    type: NotificationTypesEnum;

    createdAt?: Date;
    updatedAt?: Date;
}