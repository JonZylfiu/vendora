import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateId } from "../middleware/validation.middleware.js";
import { getById, update, deleteUserAccount, getAll } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get(
    "/",
    getAll
);

userRouter.get(
    "/:id",
    validateId,
    getById
);

userRouter.patch(
    "/:id",
    validateId,
    update
);

userRouter.delete(
    "/:id",
    validateId,
    deleteUserAccount
);

export default userRouter;
