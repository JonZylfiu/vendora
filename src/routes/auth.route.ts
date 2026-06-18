import express from "express";
import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { changePassword, login, register, resendVerificationToken, verifyEmail } from "../controllers/auth.controller.js";
import { validateEmailFormat, validateHasParameter, validatePasswordFormat } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// /auth

router.post(
    "/register", 
    validateHasParameter("name", "surname", "city", "phone", "age", "location"),
    validateEmailFormat,
    validatePasswordFormat,
    register
);

router.post(
    "/login",
    authLimiter,
    validateEmailFormat,
    validatePasswordFormat,
    login
);

router.post(
    "/change-password",
    authMiddleware,
    validateHasParameter("currentPassword", "newPassword", "confirmNewPassword"),
    validatePasswordFormat,
    changePassword
);

router.get(
    "/verify-email/:token",
    verifyEmail
)

router.post(
    "/resend-token",
    validateEmailFormat,
    resendVerificationToken
);

export default router;
