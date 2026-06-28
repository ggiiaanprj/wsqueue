// Sample CRUD imports
import { eq } from "drizzle-orm";
import { db, pool } from "./db/db.js";

// Sample schema imports
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Define the 'demo_users' table
export const demoUsers = pgTable("demo_users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Export types for type-safe queries
export type User = typeof demoUsers.$inferSelect;
export type NewUser = typeof demoUsers.$inferInsert;

// Sample CRUD
async function main() {
    try {
        console.log("Performing CRUD operations...");

        // CREATE: Insert a new user
        const [newUser] = await db
            .insert(demoUsers)
            .values({ name: "Admin User", email: "admin@example.com" })
            .returning();

        if (!newUser) {
            throw new Error("Failed to create user");
        }

        console.log("✅ CREATE: New user created:", newUser);

        // READ: Select the user
        const foundUser = await db
            .select()
            .from(demoUsers)
            .where(eq(demoUsers.id, newUser.id));
        console.log("✅ READ: Found user:", foundUser[0]);

        // UPDATE: Change the user's name
        const [updatedUser] = await db
            .update(demoUsers)
            .set({ name: "Super Admin" })
            .where(eq(demoUsers.id, newUser.id))
            .returning();

        if (!updatedUser) {
            throw new Error("Failed to update user");
        }

        console.log("✅ UPDATE: User updated:", updatedUser);

        // DELETE: Remove the user
        await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
        console.log("✅ DELETE: User deleted.");

        console.log("\nCRUD operations completed successfully.");
    } catch (error) {
        console.error("❌ Error performing CRUD operations:", error);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.end();
            console.log("Database pool closed.");
        }
    }
}

main();
