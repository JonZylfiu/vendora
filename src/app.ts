import express, { type Request, type Response } from "express";
import 'dotenv/config';
import helmet from "helmet";
import cors from "cors";

import { appLimiter } from "./middleware/rate-limit.middleware.js";
import initDbConnection from "./config/database.config.js";
import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middleware/error.middleware.js";
import itemRouter from "./routes/item.route.js";
import orderRouter from "./routes/order.route.js";
import bidRouter from "./routes/bid.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(appLimiter);
app.use(express.json());

initDbConnection();


app.use("/api/auth/", authRouter)
app.use("/api/items/", itemRouter);
app.use("/api/orders/", orderRouter);
app.use("/api/bids/", bidRouter);

// Error Middleware Handler;
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})
