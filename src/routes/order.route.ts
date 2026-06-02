import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { create, getById, deleteOrder, updateState, getAll } from "../controllers/order.controller.js";
import { validateState } from "../middleware/order.middleware.js";

const orderRouter = Router();

orderRouter.use(authMiddleware);

orderRouter.get(
    "/:id",
    validateId,
    getById
);

orderRouter.get(
    "/",
    getAll
);


orderRouter.post(
    "/",
    validateHasParameter("item"),
    create
);

orderRouter.patch(
    "/:id/status",
    validateHasParameter("state"),
    validateState,
    validateId,
    updateState
);

orderRouter.delete(
    "/:id",
    validateId,
    deleteOrder
);

export default orderRouter;