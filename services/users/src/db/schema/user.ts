import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timestamp";

export const users = pgTable("users", {
	id: uuid("id").primaryKey(),
	username: varchar("username", { length: 50 }).notNull().unique(),
	displayName: varchar("display_name", { length: 100 }).notNull(),
	avatarUrl: varchar("avatar_url", { length: 500 }),
	bio: varchar("bio", { length: 500 }),
	...timestamps,
});
