import {
	boolean,
	index,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
};

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
	(table) => [index("users_active_idx").on(table.isActive)],
);

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
