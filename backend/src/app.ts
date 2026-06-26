import express from "express";

import { queueRouter } from "./routes/queue.routes.js";

export const app = express();

app.use(express.json());

app.use("/queue", queueRouter);
