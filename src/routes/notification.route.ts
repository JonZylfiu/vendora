import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { remove, getUsers } from "../controllers/notification.controller.js";


const notificationRouter = Router();


notificationRouter.use(authMiddleware);

notificationRouter.get(
    "/",
    getUsers
)

notificationRouter.delete(
    "/:id",
    remove
);

export default notificationRouter;