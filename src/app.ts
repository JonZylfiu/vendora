import express, { type Request, type Response } from "express";
import 'dotenv/config';

import helmet from "helmet";
import cors from "cors";

import { appLimiter } from "./middleware/rate-limit.middleware.js";
import initDbConnection from "./config/database.config.js";
import authRouter from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(appLimiter);
app.use(express.json());

initDbConnection();

// app.get("/", (req, res) => {
//     // req.body.email
//     res.send("Hello World");
// })

app.use("/api/auth/", authRouter)


app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})
