import type { Request, Response } from "express";
import {
    entryIdParamsSchema,
    queueIdParamsSchema,
} from "../validators/queue.validator.js";
import { queueEntryService } from "../services/queue-entry.service.js";
import { broadcastQueueUpdate } from "../ws/socket-server.js";

export async function getQueueEntries(req: Request, res: Response) {
    const queueIdValidation = queueIdParamsSchema.safeParse(req.params);

    if (!queueIdValidation.success) {
        return res.status(400).json({ message: "Invalid queue id" });
    }

    try {
        const entries = await queueEntryService.getByQueueId(
            queueIdValidation.data.queueId,
        );

        return res.status(200).json({ message: "Entries found", entries });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: e });
    }
}

export async function getActiveQueueEntries(req: Request, res: Response) {
    const queueIdValidation = queueIdParamsSchema.safeParse(req.params);

    if (!queueIdValidation.success) {
        return res.status(400).json({ message: "Invalid queue id" });
    }

    try {
        const entries = await queueEntryService.getActiveByQueueId(
            queueIdValidation.data.queueId,
        );

        return res
            .status(200)
            .json({ message: "Active entries found", entries });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: e });
    }
}

export async function getUserInfo(req: Request, res: Response) {
    const queueIdValidation = queueIdParamsSchema.safeParse(req.params);

    if (!queueIdValidation.success) {
        return res.status(400).json({ message: "Invalid queue id" });
    }

    const entryIdValidation = entryIdParamsSchema.safeParse(req.params);

    if (!entryIdValidation.success) {
        return res.status(400).json({ message: "Invalid entry id" });
    }

    try {
        const userInfo = await queueEntryService.getUserQueueInfo(
            queueIdValidation.data.queueId,
            entryIdValidation.data.entryId,
        );

        if (!userInfo) {
            return res.status(404).json({
                message: "User queue info found",
            });
        }

        return res.status(200).json({
            message: "User found",
            userInfo,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: e });
    }
}

export async function getQueueOverview(req: Request, res: Response) {
    const queueIdValidation = queueIdParamsSchema.safeParse(req.params);

    if (!queueIdValidation.success) {
        return res.status(400).json({ message: "Invalid queue id" });
    }

    try {
        const panel = await queueEntryService.getQueueOverview(
            queueIdValidation.data.queueId,
        );

        return res.status(200).json({
            message: "Operator panel found",
            panel,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function advanceQueue(req: Request, res: Response) {
    const queueIdValidation = queueIdParamsSchema.safeParse(req.params);

    if (!queueIdValidation.success) {
        return res.status(400).json({ message: "Invalid queue id" });
    }

    try {
        const entries = await queueEntryService.advance(
            queueIdValidation.data.queueId,
        );

        if (!entries) {
            return res.status(404).json({
                message: "Queue entries is empty",
            });
        }

        broadcastQueueUpdate(queueIdValidation.data.queueId);

        return res.status(200).json({
            message: "User advanced successfully",
            entries,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: e });
    }
}

export async function leaveQueue(req: Request, res: Response) {
    const queueIdValidation = queueIdParamsSchema.safeParse(req.params);

    if (!queueIdValidation.success) {
        return res.status(400).json({ message: "Invalid queue id" });
    }

    const entryIdValidation = entryIdParamsSchema.safeParse(req.params);

    if (!entryIdValidation.success) {
        return res.status(400).json({ message: "Invalid entry id" });
    }

    try {
        const entries = await queueEntryService.leave(
            entryIdValidation.data.entryId,
        );

        if (!entries) {
            return res.status(404).json({
                message: "Queue entries not found",
            });
        }

        broadcastQueueUpdate(queueIdValidation.data.queueId);

        return res.status(200).json({
            message: "User left queue",
            entries,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: e });
    }
}
