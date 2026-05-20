import express, { type Request, type Response } from "express";
import dotenv from 'dotenv';
import helmet from "helmet";
import cors from "cors";

import { appLimiter } from "./middleware/rate-limit.middleware.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT;



app.use(helmet());
app.use(cors());
app.use(appLimiter);
app.use(express.json());


app.get("/", (req, res) => {
    // req.body.email
    res.send("Hello World");
})

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})