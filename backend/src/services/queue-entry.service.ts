import { asc, and, eq, lt, count } from "drizzle-orm";
import { db } from "../db/db.js";
import { queueEntries, users } from "../db/schema.js";

export const queueEntryService = {
    async getByQueueId(queueId: number) {
        return await db
            .select()
            .from(queueEntries)
            .where(eq(queueEntries.queueId, queueId))
            .orderBy(asc(queueEntries.joinedAt));
    },

    async getActiveByQueueId(queueId: number) {
        const entries = await db
            .select()
            .from(queueEntries)
            .where(
                and(
                    eq(queueEntries.queueId, queueId),
                    eq(queueEntries.status, "waiting"),
                ),
            )
            .orderBy(asc(queueEntries.joinedAt));

        return entries.map((entry, index) => ({
            ...entry,
            currentPosition: index + 1,
        }));
    },

    async getUserQueueInfo(queueId: number, entryId: number) {
        const [entry] = await db
            .select()
            .from(queueEntries)
            .where(
                and(
                    eq(queueEntries.id, entryId),
                    eq(queueEntries.queueId, queueId),
                ),
            );

        if (!entry || entry.status !== "waiting") {
            return null;
        }

        const result = await db
            .select({ ahead: count() })
            .from(queueEntries)
            .where(
                and(
                    eq(queueEntries.queueId, queueId),
                    eq(queueEntries.status, "waiting"),
                    lt(queueEntries.joinedAt, entry.joinedAt),
                ),
            );

        const ahead = result[0]?.ahead ?? 0;

        return {
            entryId: entry.id,
            queueId: entry.queueId,
            userId: entry.userId,
            ticket: entry.ticket,
            status: entry.status,
            currentPosition: ahead + 1,
            peopleAhead: ahead,
        };
    },

    async getQueueOverview(queueId: number) {
        const entries = await db
            .select({
                entryId: queueEntries.id,
                name: users.name,
                ticket: queueEntries.ticket,
                status: queueEntries.status,
            })
            .from(queueEntries)
            .innerJoin(users, eq(queueEntries.userId, users.id))
            .where(eq(queueEntries.queueId, queueId))
            .orderBy(asc(queueEntries.joinedAt));

        const activeEntries = entries.filter(
            (entry) => entry.status === "waiting",
        );
        const servedEntries = entries.filter(
            (entry) => entry.status === "served",
        );
        const leftEntries = entries.filter((entry) => entry.status === "left");

        return {
            stats: {
                active: activeEntries.length,
                served: servedEntries.length,
                left: leftEntries.length,
            },
            entries: activeEntries,
        };
    },

    async advance(queueId: number) {
        return await db.transaction(async (tx) => {
            const entries = await tx
                .select()
                .from(queueEntries)
                .where(
                    and(
                        eq(queueEntries.queueId, queueId),
                        eq(queueEntries.status, "waiting"),
                    ),
                )
                .orderBy(asc(queueEntries.joinedAt));

            const currentEntry = entries[0];

            if (!currentEntry) return null;

            const [updateEntry] = await tx
                .update(queueEntries)
                .set({ status: "served" })
                .where(eq(queueEntries.id, currentEntry.id))
                .returning();

            return updateEntry;
        });
    },

    async leave(entryId: number) {
        const [entry] = await db
            .update(queueEntries)
            .set({ status: "left" })
            .where(
                and(
                    eq(queueEntries.id, entryId),
                    eq(queueEntries.status, "waiting"),
                ),
            )
            .returning();

        return entry;
    },
};
