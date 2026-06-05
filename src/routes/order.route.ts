import { Router, type Request, type Response, type NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { create, getById, deleteOrder, updateState, getUserOrders } from "../controllers/order.controller.js";
import { validateState } from "../middleware/order.middleware.js";


const orderRouter = Router();

orderRouter.use(authMiddleware);

orderRouter.get(
    "/",
    getUserOrders
);

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