import { BadRequestError } from "@chat-app/errors";
import { AUTH_TOPICS } from "@chat-app/events";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { accounts, passwordResetTokens } from "../db/schema";
import { publishAuthEvent } from "../events/publish";
import type { ResetPasswordInput } from "./../routes/password-reset/schema";
import { hashPassword } from "../utils/password";

export const resetPassword = async (resetPasswordInput: ResetPasswordInput) => {
	const [record] = await db
		.select({
			accountId: passwordResetTokens.accountId,
			email: accounts.email,
		})
		.from(passwordResetTokens)
		.innerJoin(accounts, eq(accounts.id, passwordResetTokens.accountId))
		.where(
			and(
				eq(passwordResetTokens.id, resetPasswordInput.token),
				gt(passwordResetTokens.expiresAt, new Date()),
			),
		);
	if (!record) {
		throw new BadRequestError("Invalid or expired reset token");
	}

	const passwordHash = await hashPassword(resetPasswordInput.password);

	await db.transaction(async (tx) => {
		await tx
			.update(accounts)
			.set({ passwordHash })
			.where(eq(accounts.id, record.accountId));

		await tx
			.delete(passwordResetTokens)
			.where(eq(passwordResetTokens.id, resetPasswordInput.token));
	});

	await publishAuthEvent({
		topic: AUTH_TOPICS.ACCOUNT_PASSWORD_RESET_COMPLETED,
		key: record.accountId,
		value: {
			accountId: record.accountId,
			email: record.email,
		},
	});
};
