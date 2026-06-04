import type INotification from "../models/interfaces/INotification.interface.js";


export const toNotificationResponseDto = (data: INotification) => {
    const { message, type } = data;

    return {
        message,
        type
    }
}