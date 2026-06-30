import { joinQueueResponseSchema } from "../schemas/api";
import type { JoinQueue } from "../types/api";
import { apiFetch } from "./api";

export const queueService = {
    async join(queueId: number, name: string): Promise<JoinQueue> {
        return apiFetch(`/queue/${queueId}/join`, joinQueueResponseSchema, {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    },
};
