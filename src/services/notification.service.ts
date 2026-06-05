import type NotificationRequestDto from "../dtos/notification/notification-request.dto.js";
import type NotificationResponseDto from "../dtos/notification/notification-response.dto.js";
import { toNotificationResponseDto } from "../mapper/notification.mapper.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import type JwtPayload from "../types/jwt-payload.type.js";
import { getEntityById } from "../utils/validate.util.js";



export const createNotification = async (data: NotificationRequestDto) => {    
    const notification = await Notification.create(data);

    return toNotificationResponseDto(notification);
}

export const getUserNotifications = async (user: JwtPayload) => {
    await getEntityById(user.id, User);

    const notifications = await Notification.find({
        receiver: user.id
    })

    const res: NotificationResponseDto[] = [];

    for(const notification of notifications) {
        res.push(toNotificationResponseDto(notification));
    }

    return res;
}

export const deleteNotification = async (id: string) => {
    const deleted = await Notification.findByIdAndDelete(id);

    if(deleted) {
        return true;
    }
}