import {
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
	id: uuid("id").primaryKey().defaultRandom(),
	conversationId: uuid("conversation_id").notNull(),
	senderId: uuid("sender_id").notNull(),

	type: varchar("type", { length: 20 }).notNull().default("text"), // text | image | file | audio | video | system

	content: text("content"),

	// media fields (nullable)
	mediaUrl: varchar("media_url", { length: 1000 }),
	mediaType: varchar("media_type", { length: 100 }),
	mediaSize: integer("media_size"), // bytes
	mediaMeta: jsonb("media_meta"),

	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
