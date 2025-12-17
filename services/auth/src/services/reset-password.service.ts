import { BadRequestError } from "@chat-app/errors";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema/account";
import { passwordResetTokens } from "../db/schema/password-reset";
import type { ResetPasswordInput } from "./../routes/password-reset/schema";
import { refreshTokenStore } from "../store/refresh-token.store";
import { hashPassword } from "../utils/password";

export const resetPassword = async (resetPasswordInput: ResetPasswordInput) => {
	const [record] = await db
		.select()
		.from(passwordResetTokens)
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

	await refreshTokenStore.revokeAll(record.accountId);

	// TODO: Send password reset successful email
};
