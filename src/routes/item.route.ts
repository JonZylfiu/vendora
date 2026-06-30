import { Router } from "express";
import { validateEnum, validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createItemController, deleteItemController, getItemByIdController, updateItemController, getAllItemsController, changeItemStateController } from "../controllers/item.controller.js";
import { upload } from "../config/multer.js";
import { getCachedItems } from "../middleware/items.middleware.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import ItemCategoriesEnum from "../enums/item-categories.enum.js";

const itemRouter = Router();

itemRouter.use(authMiddleware);

itemRouter.get(
    "/",
    getCachedItems,
    getAllItemsController
);

itemRouter.get(
    "/:id",
    validateId,
    getItemByIdController
);

itemRouter.post(
    "/",
    upload.array("images", 5),
    validateHasParameter("title", "description", "startingPrice", "state", "category", "tags"),
    validateEnum({
        "state": ItemStatesEnum,
        "category": ItemCategoriesEnum
    }),
    createItemController
)

itemRouter.put(
    "/:id",
    validateId,
    upload.array("images", 5),
    updateItemController
);

itemRouter.patch(
    "/:id",
    validateId,
    validateEnum({ "state": ItemStatesEnum }),
    changeItemStateController
);

itemRouter.delete(
    "/:id",
    validateId,
    deleteItemController
);


export default itemRouter;