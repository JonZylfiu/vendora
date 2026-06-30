import { Router } from "express";
import { createBidController, getAllBidsByItemIdController, deleteBidController, updateBidController, getBidByIdController } from "../controllers/bid.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateHasParameter, validateId } from "../middleware/validation.middleware.js";
import { getCachedBidsByItemId } from "../middleware/bid.middleware.js";

const bidRouter = Router();
bidRouter.use(authMiddleware);

bidRouter.post(
    "/",
    validateHasParameter("itemId", "amount"),
    createBidController
);

bidRouter.get(
    "/item/:id",
    validateId,
    getCachedBidsByItemId,
    getAllBidsByItemIdController
);

bidRouter.get(
    "/:id",
    validateId,
    getBidByIdController
);

bidRouter.patch(
    "/:id",
    validateHasParameter("amount"),
    validateId,
    updateBidController
);

bidRouter.delete(
    "/:id",
    validateId,
    deleteBidController
);

export default bidRouter;