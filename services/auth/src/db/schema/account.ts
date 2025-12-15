import { relations } from "drizzle-orm";
import { boolean, index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { emailVerificationTokens } from "./email-verification";
import { passwordResetTokens } from "./password-reset";
import { timestamps } from "./timestamp";

export const accounts = pgTable(
	"accounts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		email: varchar("email", { length: 255 }).notNull().unique(),
		passwordHash: varchar("password_hash", { length: 255 }),
		isEmailVerified: boolean("is_email_verified").notNull().default(false),
		isActive: boolean("is_active").notNull().default(true),
		authProvider: varchar("auth_provider", { length: 50 })
			.notNull()
			.default("local"),
		...timestamps,
	},
	(table) => ({
		activeIdx: index("users_active_idx").on(table.isActive),
	}),
);

export const accountsRelations = relations(accounts, ({ many }) => ({
	emailVerificationTokens: many(emailVerificationTokens),
	passwordResetTokens: many(passwordResetTokens),
}));
