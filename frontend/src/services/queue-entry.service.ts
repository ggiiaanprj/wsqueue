import { apiFetch } from "./api";

import {
    advanceResponseSchema,
    getOverviewResponseSchema,
    getUserInfoResponseSchema,
    leaveResponseSchema,
} from "../schemas/api";

import type {
    GetUserInfoResponse,
    GetOverviewResponse,
    AdvanceResponse,
    LeaveResponse,
} from "../types/api";

export const queueEntryService = {
    async getUserInfo(
        queueId: number,
        entryId: number,
    ): Promise<GetUserInfoResponse> {
        return apiFetch(
            `/queue-entry/${queueId}/entries/${entryId}/info`,
            getUserInfoResponseSchema,
        );
    },

    async getOverview(queueId: number): Promise<GetOverviewResponse> {
        return apiFetch(
            `/queue-entry/${queueId}/overview`,
            getOverviewResponseSchema,
        );
    },

    async advance(queueId: number): Promise<AdvanceResponse> {
        return apiFetch(
            `/queue-entry/${queueId}/advance`,
            advanceResponseSchema,
            {
                method: "PATCH",
            },
        );
    },

    async leave(queueId: number, entryId: number): Promise<LeaveResponse> {
        return apiFetch(
            `/queue-entry/${queueId}/entries/${entryId}/leave`,
            leaveResponseSchema,
            {
                method: "PATCH",
            },
        );
    },
};
