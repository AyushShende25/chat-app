import {
	pgTable,
	primaryKey,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const timestamps = {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
};

export const conversations = pgTable("conversations", {
	id: uuid("id").primaryKey().defaultRandom(),
	type: varchar("type", { length: 20 }).notNull(), // "direct" | "group"
	title: varchar("title", { length: 100 }), // only for groups
	createdBy: uuid("created_by").notNull(),
	lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
	...timestamps,
});

export const conversationParticipants = pgTable(
	"conversation_participants",
	{
		conversationId: uuid("conversation_id")
			.references(() => conversations.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id").notNull(),
		role: varchar("role", { length: 20 }) // "member" | "admin"
			.notNull()
			.default("member"),
		joinedAt: timestamp("joined_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		lastReadMessageId: uuid("last_read_message_id"),
		...timestamps,
	},
	(t) => [primaryKey({ columns: [t.conversationId, t.userId] })],
);
