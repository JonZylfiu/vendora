import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { remove, getUsers } from "../controllers/notification.controller.js";
import { validateId } from "../middleware/validation.middleware.js";

const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get(
    "/",
    getUsers
);

notificationRouter.delete(
    "/:id",
    validateId,
    remove
);

export default notificationRouter;