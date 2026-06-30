import { Router } from "express";

import {
    createQueue,
    getQueueById,
    joinQueue,
} from "../controllers/queue.controller.js";

export const queueRouter = Router();

queueRouter.post("/", createQueue);
queueRouter.get("/:queueId", getQueueById);
queueRouter.post("/:queueId/join", joinQueue);
