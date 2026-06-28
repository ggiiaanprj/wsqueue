import z from "zod";

export const createQueueSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Queue name must contain at least 3 characters.")
        .regex(/[A-Za-z]/, "Queue name must contain at least one letter."),
});

export const queueIdParamsSchema = z.object({
    queueId: z.coerce
        .number("Queue id must be a number.")
        .int("Queue id must be an integer."),
});

export type CreateQueue = z.infer<typeof createQueueSchema>;
