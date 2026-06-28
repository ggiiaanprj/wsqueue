import { db } from "../db/db.js";
import { queues } from "../db/schema.js";
import { eq } from "drizzle-orm";

import type { CreateQueue } from "../validators/queue.validator.js";

export const queueService = {
    async create(data: CreateQueue) {
        const [newQueue] = await db.insert(queues).values(data).returning();

        return newQueue;
    },

    async getById(id: number) {
        const [queue] = await db.select().from(queues).where(eq(queues.id, id));

        return queue;
    },
};
