import EventEmitter from "node:events";
import { createNotification } from "../services/notification.service.js";
import NotificationTypesEnum from "../enums/notification-types.enum.js";

const notificationEmitter = new EventEmitter();

const sendNotification = (receiver: string, message: string, type: NotificationTypesEnum) => {
    createNotification({
        receiver,
        message,
        type
    }).catch((e) => {
        console.log(e);
    })
}

notificationEmitter.on("higher-bid", (receiver: string, itemId: string, amount: number) => {
    const message = `Higher bid is placed at item with id: ${itemId}, with amount: ${amount}`;
    sendNotification(receiver, message, NotificationTypesEnum.HIGHER_BID_ALERT);
})

notificationEmitter.on("bid-accepted", (receiver: string, itemId: string) => {
    const message = `CONGRATS! Your bid at item with id : ${itemId}, is accepted!`;
    sendNotification(receiver, message, NotificationTypesEnum.BID_ACCEPTED);
})

notificationEmitter.on("order-shipped", (receiver: string, orderId: string) => {
    const message = `Order with id: ${orderId} is shipped`;
    sendNotification(receiver, message, NotificationTypesEnum.ORDER_SHIPPED);
})

notificationEmitter.on("order-received", (receiver: string, orderId: string) => {
    const message = `Order with id: ${orderId} is received!`;
    sendNotification(receiver, message, NotificationTypesEnum.ORDER_RECEIVED);
})

notificationEmitter.on("order-cancelled", (receiver: string, orderId: string) => {
    const message = `Order with id: ${orderId} is cancelled!`;
    sendNotification(receiver, message, NotificationTypesEnum.ORDER_CANCELLED);
})


export default notificationEmitter;