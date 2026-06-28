import type { Request, Response } from "express";

import {
    createQueueSchema,
    queueIdParamsSchema,
} from "../validators/queue.validator.js";

import { queueService } from "../services/queue.service.js";
import { createUserSchema } from "../validators/user.validator.js";
import { userService } from "../services/user.service.js";

export async function createQueue(req: Request, res: Response) {
    const validation = createQueueSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid payload",
            details: validation.error.issues,
        });
    }

    try {
        const newQueue = await queueService.create(validation.data);

        return res.status(201).json({
            message: "Queue created",
            queue: newQueue,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: e });
    }
}

export async function getQueueById(req: Request, res: Response) {
    const validation = queueIdParamsSchema.safeParse(req.params);

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid queue id",
            details: validation.error.issues,
        });
    }

    const { queueId } = validation.data;

    try {
        const queue = await queueService.getById(queueId);

        if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }

        return res.status(200).json({ message: "Queue found", queue });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: e });
    }
}

export async function joinQueue(req: Request, res: Response) {
    const queueIdValidation = queueIdParamsSchema.safeParse(req.params);

    if (!queueIdValidation.success) {
        return res.status(400).json({
            message: "Invalid queue id",
            details: queueIdValidation.error.issues,
        });
    }

    const userValidation = createUserSchema.safeParse(req.body);

    if (!userValidation.success) {
        return res.status(400).json({
            message: "Invalid payload",
            details: userValidation.error.issues,
        });
    }

    try {
        const { queueId } = queueIdValidation.data;
        const queue = await queueService.getById(queueId);
        if (!queue) {
            return res.status(404).json({
                message: "Queue not found",
            });
        }

        const newUser = await userService.create(userValidation.data);

        return res.status(201).json({
            message: "User joined queue",
            queueId: queue.id,
            user: newUser,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: e });
    }
}
