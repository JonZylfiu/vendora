import express from "express";
import { authLimiter } from "../middleware/rate-limit.middleware.js";

const Router = express.Router();

Router.post("/login", authLimiter);


export default Router;
