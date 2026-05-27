import express from "express";
// import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

// router.post("/login", authLimiter);

router.post("/register", register);
router.post("/login", login);



export default router;
