import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";

import { create, getById, update, deleteOrder } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.use(authMiddleware);

orderRouter.get(
    "/:id",
    validateId,
    getById
);

orderRouter.post(
    "/",
    validateHasParameter("items", "state", "totalPrice"),
    create
);

orderRouter.patch(
    "/:id",
    validateId,
    update
);

orderRouter.delete(
    "/:id",
    validateId,
    deleteOrder
);

export default orderRouter;