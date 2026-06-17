import express from "express";
import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { login, register, verifyEmail } from "../controllers/auth.controller.js";
import { validateEmailFormat, validateHasParameter, validatePasswordLength } from "../middleware/validation.middleware.js";

const router = express.Router();

// /auth

router.post(
    "/register", 
    validateHasParameter("name", "surname", "email", "password", "city", "phone", "age", "location"),
    validateEmailFormat,
    validatePasswordLength,
    register
);

router.post(
    "/login",
    authLimiter,
    validateHasParameter("email", "password"),
    login
);

router.get(
    "/verify-email/:token",
    verifyEmail
)

export default router;
