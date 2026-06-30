import { type Request, type Response } from "express"
import type NotificationResponseDto from "../dtos/notification/notification-response.dto.js"
import { deleteNotificationService, getUserNotificationsService } from "../services/notification.service.js"
import { response } from "../utils/api-response.util.js"


export const getUserNotificationsController = async (req: Request, res: Response) => {
    const notifications: NotificationResponseDto[] = await getUserNotificationsService(req.user);

    return response(res, 200, null, notifications);
}

export const deleteNotificationController = async (req: Request<{id: string}>, res: Response) => {
    const deleted = await deleteNotificationService(req.params.id, req.user);

    if(deleted) {
        return response(res, 200, "Notification deleted successfully", null);
    }
}