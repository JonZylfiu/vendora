import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deleteNotificationController, getUserNotificationsController } from "../controllers/notification.controller.js";
import { validateId } from "../middleware/validation.middleware.js";

const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get(
    "/",
    getUserNotificationsController
);

notificationRouter.delete(
    "/:id",
    validateId,
    deleteNotificationController
);

export default notificationRouter;