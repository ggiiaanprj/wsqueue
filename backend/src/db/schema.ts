import {
    pgTable,
    serial,
    integer,
    text,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

export const queueStatus = pgEnum("queue_status", ["open", "paused", "closed"]);
export const entryStatus = pgEnum("entry_status", [
    "waiting",
    "ready",
    "served",
    "left",
]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const queues = pgTable("queues", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    status: queueStatus("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const queueEntries = pgTable("queue_entries", {
    id: serial("id").primaryKey(),
    queueId: integer("queue_id")
        .notNull()
        .references(() => queues.id),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
    arrivalNumber: integer("arrival_number").notNull(),
    status: entryStatus("status").notNull().default("waiting"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// Select (read) types
export type User = typeof users.$inferSelect;
export type Queue = typeof queues.$inferSelect;
export type QueueEntry = typeof queueEntries.$inferSelect;

// Insert (create) types
export type NewUser = typeof users.$inferInsert;
export type NewQueue = typeof queues.$inferInsert;
export type NewQueueEntry = typeof queueEntries.$inferInsert;
