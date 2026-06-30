import express from "express";
import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { changePasswordAuthController, loginAuthController, registerAuthController, resendVerificationTokenAuthController, verifyEmailAuthController } from "../controllers/auth.controller.js";
import { validateEmailFormat, validateHasParameter, validatePasswordFormat } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// /auth

router.post(
    "/register", 
    validateHasParameter("name", "surname", "city", "phone", "age", "location"),
    validateEmailFormat,
    validatePasswordFormat,
    registerAuthController
);

router.post(
    "/login",
    authLimiter,
    validateEmailFormat,
    validatePasswordFormat,
    loginAuthController
);

router.post(
    "/change-password",
    authMiddleware,
    validateHasParameter("currentPassword", "newPassword", "confirmNewPassword"),
    validatePasswordFormat,
    changePasswordAuthController
);

router.get(
    "/verify-email/:token",
    verifyEmailAuthController
)

router.post(
    "/resend-token",
    validateEmailFormat,
    resendVerificationTokenAuthController
);

export default router;
