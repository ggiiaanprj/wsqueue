import { Router } from "express";
import {
    advanceQueue,
    getActiveQueueEntries,
    getQueueEntries,
    getQueueOverview,
    getUserInfo,
    leaveQueue,
} from "../controllers/queue-entry.controller.js";

export const queueEntryRouter = Router();

queueEntryRouter.get("/:queueId/entries", getQueueEntries);
queueEntryRouter.get("/:queueId/active-entries", getActiveQueueEntries);
queueEntryRouter.get("/:queueId/entries/:entryId/info", getUserInfo);

queueEntryRouter.get("/:queueId/overview", getQueueOverview);
queueEntryRouter.patch("/:queueId/advance", advanceQueue);
queueEntryRouter.patch("/:queueId/entries/:entryId/leave", leaveQueue);
