import { BadRequestError } from "@chat-app/errors";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema/account";
import { emailVerificationTokens } from "../db/schema/email-verification";
import type { VerifyEmailInput } from "./../routes/verify-email/schema";

export const verifyEmail = async (verifyEmailInput: VerifyEmailInput) => {
	const [record] = await db
		.select()
		.from(emailVerificationTokens)
		.where(
			and(
				eq(emailVerificationTokens.id, verifyEmailInput.token),
				gt(emailVerificationTokens.expiresAt, new Date()),
			),
		);

	if (!record) {
		throw new BadRequestError("Invalid or expired verification token");
	}

	await db.transaction(async (tx) => {
		await tx
			.update(accounts)
			.set({ isEmailVerified: true })
			.where(eq(accounts.id, record.accountId));

		await tx
			.delete(emailVerificationTokens)
			.where(eq(emailVerificationTokens.id, verifyEmailInput.token));
	});
};
