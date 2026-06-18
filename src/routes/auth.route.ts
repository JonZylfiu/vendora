import express from "express";
import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { login, register, resendVerificationToken, verifyEmail } from "../controllers/auth.controller.js";
import { validateEmailFormat, validateHasParameter, validatePasswordLength } from "../middleware/validation.middleware.js";

const router = express.Router();

// /auth

router.post(
    "/register", 
    validateHasParameter("name", "surname", "city", "phone", "age", "location"),
    validateEmailFormat,
    validatePasswordLength,
    register
);

router.post(
    "/login",
    authLimiter,
    validateEmailFormat,
    validatePasswordLength,
    login
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
