import { Router } from "express";

import { createQueue, getQueueById } from "../controllers/queue.controller.js";

export const queueRouter = Router();

queueRouter.post("/", createQueue);

queueRouter.get("/:id", getQueueById);
