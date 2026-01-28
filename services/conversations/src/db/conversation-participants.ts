import {
	pgTable,
	primaryKey,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { conversations } from "./conversations";
import { timestamps } from "./schema/timestamp";

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

		lastReadMessageId: uuid("last_read_message_id"), // later

		...timestamps,
	},
	(t) => [primaryKey({ columns: [t.conversationId, t.userId] })],
);
