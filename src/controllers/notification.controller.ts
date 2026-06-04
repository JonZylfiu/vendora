import { type Request, type Response } from "express"
import type NotificationResponseDto from "../dtos/notification/notification-response.dto.js"
import { deleteNotification, getNotificationsByUserId } from "../services/notification.service.js"
import { response } from "../utils/api-response.util.js"


export const getByUserId = async (req: Request, res: Response) => {
    const notifications: NotificationResponseDto[] = await getNotificationsByUserId(req.user.id);

    return response(notifications, null, 200, res);
}

export const remove = async (req: Request<{id: string}>, res: Response) => {
    const deleted = await deleteNotification(req.params.id);

    if(deleted) {
        return response(null, "Notification deleted successfully", 200, res);
    }
}