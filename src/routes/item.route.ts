import { Router } from "express";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { create, deleteItem, getById, update } from "../controllers/item.controller.js";

const itemRouter = Router();

itemRouter.use(authMiddleware);

itemRouter.get(
    "/:id",
    validateId,
    getById
);

itemRouter.post(
    "/",
    validateHasParameter("images", "title", "description", "price", "state", "category", "tags"),
    create
)

itemRouter.patch(
    "/:id",
    validateId,
    update
);

itemRouter.delete(
    "/:id",
    validateId,
    deleteItem
);


export default itemRouter;