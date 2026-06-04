import type NotificationTypesEnum from "../../enums/notification-types.enum.js";


export default interface NotificationRequestDto {
    receiver: string,
    message: string,
    type: NotificationTypesEnum
}