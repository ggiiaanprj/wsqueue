import { db } from "../db/db.js";
import { users } from "../db/schema.js";

import type { CreateUserInput } from "../validators/user.validator.js";

export const userService = {
    async create(input: CreateUserInput) {
        const [newUser] = await db.insert(users).values(input).returning();

        return newUser;
    },
};
