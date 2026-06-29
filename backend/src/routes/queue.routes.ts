import { Router } from "express";

import {
    createQueue,
    getQueueById,
    joinQueue,
} from "../controllers/queue.controller.js";
import {
    advanceQueue,
    getActiveQueueEntries,
    getQueueEntries,
    getQueueOverview,
    getUserInfo,
    leaveQueue,
} from "../controllers/queue-entry.controller.js";

export const queueRouter = Router();

queueRouter.post("/", createQueue);
queueRouter.get("/:queueId", getQueueById);
queueRouter.post("/:queueId/join", joinQueue);

queueRouter.get("/:queueId/entries", getQueueEntries);
queueRouter.get("/:queueId/active-entries", getActiveQueueEntries);
queueRouter.get("/:queueId/entries/:entryId/info", getUserInfo);

queueRouter.get("/:queueId/overview", getQueueOverview);
queueRouter.patch("/:queueId/advance", advanceQueue);
queueRouter.patch("/:queueId/entries/:entryId/leave", leaveQueue);
