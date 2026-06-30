import type { QueueOverview, UserQueueInfo, QueueEntry } from "../types/api";
import { apiFetch } from "./api";

export const queueEntryService = {
    async getUserInfo(
        queueId: number,
        entryId: number,
    ): Promise<{ message: string; userInfo: UserQueueInfo }> {
        return apiFetch(`/queue/${queueId}/entries/${entryId}/info`);
    },

    async getOverview(
        queueId: number,
    ): Promise<{ message: string; overview: QueueOverview }> {
        return apiFetch(`/queue/${queueId}/overview`);
    },

    async advance(
        queueId: number,
    ): Promise<{ message: string; entry: QueueEntry }> {
        return apiFetch(`/queue/${queueId}/advance`, {
            method: "PATCH",
        });
    },

    async leave(
        queueId: number,
        entryId: number,
    ): Promise<{ message: string; entry: QueueEntry }> {
        return apiFetch(`/queue/${queueId}/entries/${entryId}/leave`, {
            method: "PATCH",
        });
    },
};
