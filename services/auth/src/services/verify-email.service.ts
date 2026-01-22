import { BadRequestError } from "@chat-app/errors";
import { AUTH_TOPICS } from "@chat-app/events";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema/account";
import { emailVerificationTokens } from "../db/schema/email-verification";
import { publishAuthEvent } from "../events/publish";
import type { VerifyEmailInput } from "./../routes/verify-email/schema";

export const verifyEmail = async (verifyEmailInput: VerifyEmailInput) => {
	const [record] = await db
		.select({
			accountId: emailVerificationTokens.accountId,
			email: accounts.email,
		})
		.from(emailVerificationTokens)
		.innerJoin(accounts, eq(accounts.id, emailVerificationTokens.accountId))
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

	await publishAuthEvent({
		topic: AUTH_TOPICS.ACCOUNT_EMAIL_VERIFIED,
		key: record.accountId,
		value: {
			accountId: record.accountId,
			email: record.email,
		},
	});
};
