import z from "zod";

export const createUserSchema = z.object({
    name: z.string().trim().min(2, "Name must have at least 2 characters"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
