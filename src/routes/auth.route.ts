import express from "express";
// import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

// router.post("/login", authLimiter);

router.post("/register", register);


export default router;
