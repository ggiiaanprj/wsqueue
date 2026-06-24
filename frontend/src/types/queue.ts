export type QueueEntryStatus = "waiting" | "ready" | "served" | "left";

export interface QueueEntry {
    id: string;
    userId: string;
    name: string;
    ticketNumber: number;
    arrivalNumber: number;
    status: QueueEntryStatus;
    joinedAt: string;
}
