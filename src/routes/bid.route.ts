import { Router } from "express";
import { create, getAllByItemId, remove, update } from "../controllers/bid.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";

const bidRouter = Router();
bidRouter.use(authMiddleware);

bidRouter.post(
    "/",
    validateHasParameter("itemId", "amount"),
    create
);

bidRouter.patch(
    "/:bidId",
    validateHasParameter("amount"),
    validateId,
    update
);

bidRouter.delete(
    "/:bidId",
    validateId,
    remove
);

bidRouter.get(
    "/item/:itemId",
    getAllByItemId
);

export default bidRouter;