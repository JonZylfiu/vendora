import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateId } from "../middleware/validation.middleware.js";
import { getUserByIdController, updateUserController, deleteUserController, getAllUsersController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get(
    "/",
    getAllUsersController
);

userRouter.get(
    "/:id",
    validateId,
    getUserByIdController
);

userRouter.patch(
    "/:id",
    validateId,
    updateUserController
);

userRouter.delete(
    "/:id",
    validateId,
    deleteUserController
);

export default userRouter;
