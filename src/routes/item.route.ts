import { Router } from "express";
import { validateEnum, validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { create, deleteItem, getById, update, getAll, changeState } from "../controllers/item.controller.js";
import { upload } from "../config/multer.js";
import { getCachedItems } from "../middleware/items.middleware.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import ItemCategoriesEnum from "../enums/item-categories.enum.js";

const itemRouter = Router();

itemRouter.use(authMiddleware);

itemRouter.get(
    "/",
    getCachedItems,
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
    validateEnum({
        "state": ItemStatesEnum,
        "category": ItemCategoriesEnum
    }),
    create
)

itemRouter.put(
    "/:id",
    validateId,
    upload.array("images", 5),
    update
);

itemRouter.patch(
    "/:id",
    validateId,
    validateEnum({ "state": ItemStatesEnum }),
    changeState
);

itemRouter.delete(
    "/:id",
    validateId,
    deleteItem
);


export default itemRouter;