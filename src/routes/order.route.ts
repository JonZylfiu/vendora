import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";

import { create, getById, accept, delivered, cancel, deleteOrder } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.use(authMiddleware);

orderRouter.get(
    "/:id",
    validateId,
    getById
);

orderRouter.post(
    "/",
    validateHasParameter("item"),
    create
);

orderRouter.patch(
    "/:id/accept",
    validateId,
    accept
);

orderRouter.patch(
    "/:id/delivered",
    validateId,
    delivered
);

orderRouter.patch(
    "/:id/cancel",
    validateId,
    cancel
);

orderRouter.delete(
    "/:id",
    validateId,
    deleteOrder
);

export default orderRouter;