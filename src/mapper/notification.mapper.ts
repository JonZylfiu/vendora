import type INotification from "../models/interfaces/INotification.interface.js";


export const toNotificationResponseDto = (data: INotification) => {
    const { _id: id, message, type } = data;

    return {
        id,
        message,
        type
    }
}