import {
	integer,
	jsonb,
	pgTable,
	primaryKey,
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

export const conversationRefs = pgTable("conversation_refs", {
	id: uuid("id").primaryKey(),
	type: varchar("type", { length: 20 }).notNull(), // direct | group
	createdAt: timestamp("created_at").defaultNow(),
});

export const conversationParticipantRefs = pgTable(
	"conversation_participant_refs",
	{
		conversationId: uuid("conversation_id")
			.references(() => conversationRefs.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id").notNull(),
	},
	(t) => [primaryKey({ columns: [t.conversationId, t.userId] })],
);
