import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./account";
import { timestamps } from "./timestamp";

export const emailVerificationTokens = pgTable("email_verification_tokens", {
	id: uuid("id").primaryKey().defaultRandom(),
	accountId: uuid("account_id")
		.notNull()
		.references(() => accounts.id, {
			onDelete: "cascade",
		}),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	...timestamps,
});

export const emailVerificationTokensRelations = relations(
	emailVerificationTokens,
	({ one }) => ({
		account: one(accounts, {
			fields: [emailVerificationTokens.accountId],
			references: [accounts.id],
		}),
	}),
);
