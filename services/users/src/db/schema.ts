import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey(),
	username: varchar("username", { length: 50 }).notNull().unique(),
	displayName: varchar("display_name", { length: 100 }).notNull(),
	avatarUrl: varchar("avatar_url", { length: 500 }),
	bio: varchar("bio", { length: 500 }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});
