import type NotificationRequestDto from "../dtos/notification/notification-request.dto.js";
import type NotificationResponseDto from "../dtos/notification/notification-response.dto.js";
import { toNotificationResponseDto } from "../mapper/notification.mapper.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import type UserJwtPayload from "../types/jwt-payload.type.js";
import { checkIsAuthorized, getEntityById } from "../utils/validate.util.js";



export const createNotificationService = async (data: NotificationRequestDto) => {
    const notification = await Notification.create(data);

    return toNotificationResponseDto(notification);
}

export const getUserNotificationsService = async (user: UserJwtPayload) => {
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

export const deleteNotificationService = async (id: string, user: UserJwtPayload) => {
    const notification = await getEntityById(id, Notification);

    checkIsAuthorized(notification.receiver.toString(), user);

    const deleted = await notification.deleteOne();

    if(deleted.deletedCount == 1) {
        return true;
    }
}