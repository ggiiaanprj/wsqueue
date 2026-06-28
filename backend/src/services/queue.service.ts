import { db } from "../db/db.js";
import { queueEntries, queues, users } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

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

    async join(queueId: number, userData: { name: string }) {
        return await db.transaction(async (tx) => {
            const [queue] = await tx
                .select()
                .from(queues)
                .where(eq(queues.id, queueId));

            if (!queue) return null;

            const [newUser] = await tx
                .insert(users)
                .values(userData)
                .returning();

            if (!newUser) throw new Error("User was not created");

            const [queueEntry] = await tx
                .insert(queueEntries)
                .values({
                    queueId,
                    userId: newUser.id,
                    ticket: queue.nextTicket,
                })
                .returning();

            if (!queueEntry) throw new Error("Queue entry was not created");

            await tx
                .update(queues)
                .set({ nextTicket: sql`${queues.nextTicket} + 1` })
                .where(eq(queues.id, queueId));

            return {
                queue,
                user: newUser,
                entry: queueEntry,
            };
        });
    },
};
