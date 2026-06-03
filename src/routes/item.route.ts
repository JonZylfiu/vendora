import { Router } from "express";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { archive, create, deleteItem, getById, restore, sold, update } from "../controllers/item.controller.js";

const itemRouter = Router();

itemRouter.use(authMiddleware);

itemRouter.get(
    "/:id",
    validateId,
    getById
);

itemRouter.post(
    "/",
    validateHasParameter("images", "title", "description", "startingPrice", "state", "category", "tags"),
    create
)

itemRouter.patch(
    "/:id",
    validateId,
    update
);

itemRouter.patch(
    "/:id/restore",
    validateId,
    restore
);

itemRouter.patch(
    "/:id/archive",
    validateId,
    archive
);

itemRouter.patch(
    "/:id/sold",
    validateId,
    sold
);

itemRouter.delete(
    "/:id",
    validateId,
    deleteItem
);


export default itemRouter;