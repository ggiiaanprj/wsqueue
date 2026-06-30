import type { JoinQueue } from "../types/api";
import { apiFetch } from "./api";

export const queueService = {
    async join(queueId: number, name: string): Promise<JoinQueue> {
        return apiFetch<JoinQueue>(`/queue/${queueId}/join`, {
            method: "POST",
            body: JSON.stringify({ name }),
        });
    },
};
