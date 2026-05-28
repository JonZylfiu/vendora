import express from "express";
import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { login, register } from "../controllers/auth.controller.js";
import { validateEmailFormat, validateHasParameter, validatePasswordLength } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/login", authLimiter);
router.post(
    "/register", 
    validateHasParameter("name", "surname", "email", "password", "city", "phone", "age", "location"),
    validateEmailFormat,
    validatePasswordLength,
    register
);


router.post(
    "/login",
    validateHasParameter("email", "password"),
    login
);



export default router;
