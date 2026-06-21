import { Router } from "express";
import { create, getAllByItemId, remove, update, getById } from "../controllers/bid.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { getBidsByItemId } from "../middleware/bid.middleware.js";

const bidRouter = Router();
bidRouter.use(authMiddleware);

bidRouter.post(
    "/",
    validateHasParameter("itemId", "amount"),
    create
);

bidRouter.get(
    "/item/:id",
    validateId,
    getBidsByItemId,
    getAllByItemId
);

bidRouter.get(
    "/:id",
    validateId,
    getById
);

bidRouter.patch(
    "/:id",
    validateHasParameter("amount"),
    validateId,
    update
);

bidRouter.delete(
    "/:id",
    validateId,
    remove
);

export default bidRouter;