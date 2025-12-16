import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./account";
import { timestamps } from "./timestamp";

export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: uuid("id").primaryKey().defaultRandom(),
	accountId: uuid("account_id")
		.notNull()
		.references(() => accounts.id, {
			onDelete: "cascade",
		}),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	...timestamps,
});

export const passwordResetTokensRelations = relations(
	passwordResetTokens,
	({ one }) => ({
		account: one(accounts, {
			fields: [passwordResetTokens.accountId],
			references: [accounts.id],
		}),
	}),
);
