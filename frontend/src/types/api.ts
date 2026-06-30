import type { z } from "zod";
import type {
    entryStatusSchema,
    queueSchema,
    queueEntrySchema,
    queueEntryWithNameSchema,
    queueOverviewSchema,
    userQueueInfoSchema,
    joinQueueResponseSchema,
    getUserInfoResponseSchema,
    getOverviewResponseSchema,
    advanceResponseSchema,
    leaveResponseSchema,
} from "../schemas/api";

export type EntryStatus = z.infer<typeof entryStatusSchema>;
export type Queue = z.infer<typeof queueSchema>;
export type QueueEntry = z.infer<typeof queueEntrySchema>;
export type QueueEntryWithName = z.infer<typeof queueEntryWithNameSchema>;
export type QueueOverview = z.infer<typeof queueOverviewSchema>;
export type UserQueueInfo = z.infer<typeof userQueueInfoSchema>;

export type JoinQueue = z.infer<typeof joinQueueResponseSchema>;
export type GetUserInfoResponse = z.infer<typeof getUserInfoResponseSchema>;
export type GetOverviewResponse = z.infer<typeof getOverviewResponseSchema>;
export type AdvanceResponse = z.infer<typeof advanceResponseSchema>;
export type LeaveResponse = z.infer<typeof leaveResponseSchema>;
