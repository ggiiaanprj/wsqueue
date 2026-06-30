export interface Queue {
    id: number;
    name: string;
    nextTicket: number;
}

export interface User {
    id: number;
    name: string;
}

export type EntryStatus = "waiting" | "served" | "left";

export interface QueueEntry {
    id: number;
    queueId: number;
    userId: number;
    ticket: number;
    status: EntryStatus;
    joinedAt: string;
}

export interface QueueEntryWithPosition extends QueueEntry {
    currentPosition: number;
}

export interface QueueEntryWithName {
    name: string;
    ticket: number;
    status: EntryStatus;
}

export interface QueueOverview {
    stats: {
        active: number;
        served: number;
        left: number;
    };
    entries: QueueEntryWithName[];
}

export interface JoinQueue {
    message: string;
    queueId: number;
    user: {
        name: string;
    };
    entry: {
        id: number;
        ticket: number;
        status: EntryStatus;
        joinedAt: string;
    };
}

export interface UserQueueInfo {
    entryId: number;
    queueId: number;
    userId: number;
    ticket: number;
    status: EntryStatus;
    currentPosition: number;
    peopleAhead: number;
}
