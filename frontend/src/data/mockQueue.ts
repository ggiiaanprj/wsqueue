import type { QueueEntry } from "../types/queue";

export const CURRENT_USER_ID = "local-user";

export const initialQueue: QueueEntry[] = [
    {
        id: "entry-1",
        userId: "user-sample1",
        name: "Sample 1",
        ticketNumber: 699,
        arrivalNumber: 1,
        status: "waiting",
        joinedAt: "12:00",
    },
    {
        id: "entry-2",
        userId: "user-sample2",
        name: "Sample 2",
        ticketNumber: 700,
        arrivalNumber: 2,
        status: "waiting",
        joinedAt: "12:01",
    },
    {
        id: "entry-3",
        userId: "user-sample3",
        name: "Sample 3",
        ticketNumber: 701,
        arrivalNumber: 3,
        status: "waiting",
        joinedAt: "12:02",
    },
];
