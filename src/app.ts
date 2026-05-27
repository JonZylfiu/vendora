import express, { type Request, type Response } from "express";
import 'dotenv/config';

import helmet from "helmet";
import cors from "cors";

import { appLimiter } from "./middleware/rate-limit.middleware.js";
import initDbConnection from "./config/database.config.js";
import authRouter from "./routes/auth.route.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(appLimiter);
app.use(express.json());

initDbConnection();


app.use("/test", authMiddleware);
app.use("/test", (req: Request, res: Response) => {
    
    res.status(200).json({
        id: req.body.id,
        role: req.body.role
    })
});


app.use("/api/auth/", authRouter)


// Error Middleware Handler;
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})
