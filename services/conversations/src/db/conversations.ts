import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./schema/timestamp";

export const conversations = pgTable("conversations", {
	id: uuid("id").primaryKey().defaultRandom(),
	type: varchar("type", { length: 20 }).notNull(), // "direct" | "group"
	title: varchar("title", { length: 100 }), // only for groups
	createdBy: uuid("created_by").notNull(),
	lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
	...timestamps,
});
