import NotificationTypesEnum from "../../enums/notification-types.enum.js"

export default interface NotificationResponseDto {
    message: string,
    type: NotificationTypesEnum
}