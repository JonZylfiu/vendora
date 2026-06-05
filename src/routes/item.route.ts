import { Router } from "express";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { archive, create, deleteItem, getById, restore, sold, update, getAll } from "../controllers/item.controller.js";
import { upload } from "../config/multer.js";

const itemRouter = Router();

itemRouter.use(authMiddleware);

itemRouter.get(
    "/",
    getAll
);

itemRouter.get(
    "/:id",
    validateId,
    getById
);

itemRouter.post(
    "/",
    upload.array("images", 5),
    validateHasParameter("title", "description", "startingPrice", "state", "category", "tags"),
    create
)

itemRouter.patch(
    "/:id",
    validateId,
    upload.array("images", 5),
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