import { z } from "zod";

export const entryStatusSchema = z.enum(["waiting", "served", "left"]);

export const queueSchema = z.object({
    id: z.number(),
    name: z.string(),
    nextTicket: z.number(),
});

export const queueEntrySchema = z.object({
    id: z.number(),
    queueId: z.number(),
    userId: z.number(),
    ticket: z.number(),
    status: entryStatusSchema,
    joinedAt: z.string(),
});

export const queueEntryWithNameSchema = z.object({
    entryId: z.number(),
    name: z.string(),
    ticket: z.number(),
    status: entryStatusSchema,
});

export const queueOverviewSchema = z.object({
    stats: z.object({
        active: z.number(),
        served: z.number(),
        left: z.number(),
    }),
    entries: z.array(queueEntryWithNameSchema),
});

export const userQueueInfoSchema = z.object({
    entryId: z.number(),
    queueId: z.number(),
    userId: z.number(),
    ticket: z.number(),
    status: entryStatusSchema,
    currentPosition: z.number(),
    peopleAhead: z.number(),
});

// Responses

export const joinQueueResponseSchema = z.object({
    message: z.string(),
    queueId: z.number(),
    user: z.object({
        name: z.string(),
    }),
    entry: z.object({
        id: z.number(),
        ticket: z.number(),
        status: entryStatusSchema,
        joinedAt: z.string(),
    }),
});

export const getUserInfoResponseSchema = z.object({
    message: z.string(),
    userInfo: userQueueInfoSchema,
});

export const getOverviewResponseSchema = z.object({
    message: z.string(),
    panel: queueOverviewSchema,
});

export const advanceResponseSchema = z.object({
    message: z.string(),
    entries: queueEntrySchema,
});

export const leaveResponseSchema = z.object({
    message: z.string(),
    entries: queueEntrySchema,
});
