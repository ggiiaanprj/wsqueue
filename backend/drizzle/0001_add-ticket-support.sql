ALTER TABLE "queue_entries" RENAME COLUMN "arrival_number" TO "ticket";--> statement-breakpoint
ALTER TABLE "queues" ADD COLUMN "next_ticket" integer DEFAULT 1 NOT NULL;