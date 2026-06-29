import express from "express";
import cors from "cors";

import { queueRouter } from "./routes/queue.routes.js";

const allowedOrigins = ["http://localhost:5173"];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Origin not allowed: ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
};

export const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use("/queue", queueRouter);
