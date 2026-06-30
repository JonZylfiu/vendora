import { Router, type Request, type Response, type NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { createOrderController, getOrderByIdController, deleteOrderController, updateOrderStateController, getUserOrdersController } from "../controllers/order.controller.js";
import { validateState } from "../middleware/order.middleware.js";


const orderRouter = Router();

orderRouter.use(authMiddleware);

orderRouter.get(
    "/",
    getUserOrdersController
);

orderRouter.get(
    "/:id",
    validateId,
    getOrderByIdController
);

orderRouter.post(
    "/",
    validateHasParameter("item"),
    createOrderController
);

orderRouter.patch(
    "/:id/status",
    validateHasParameter("state"),
    validateState,
    validateId,
    updateOrderStateController
);

orderRouter.delete(
    "/:id",
    validateId,
    deleteOrderController
);

export default orderRouter;