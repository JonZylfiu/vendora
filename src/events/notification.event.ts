import EventEmitter from "node:events";
import { createNotification } from "../services/notification.service.js";
import NotificationTypesEnum from "../enums/notification-types.enum.js";

const notificationEmitter = new EventEmitter();


notificationEmitter.on("higher-bid", async (receiver: string, itemId: string, amount: number) => {
    await createNotification({ 
        receiver,
        message: `Higher bid is placed at item with id: ${itemId}, with amount: ${amount}`,
        type: NotificationTypesEnum.HIGHER_BID_ALERT 
    });  
})




export default notificationEmitter;