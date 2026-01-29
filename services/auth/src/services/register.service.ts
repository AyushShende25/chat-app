import { ConflictError } from "@chat-app/errors";
import { AUTH_TOPICS } from "@chat-app/events";
import { DrizzleQueryError } from "drizzle-orm";
import { db } from "../db";
import { accounts, emailVerificationTokens } from "../db/schema";
import { publishAuthEvent } from "../events/publish";
import type { RegisterInput } from "../routes/register/schema";
import { hashPassword } from "../utils/password";

export const registerAccount = async (registerInput: RegisterInput) => {
	const { email, password } = registerInput;

	const passwordHash = await hashPassword(password);

	try {
		const [account] = await db
			.insert(accounts)
			.values({
				email,
				passwordHash,
			})
			.returning();

		if (!account) {
			throw new Error("Failed to create account");
		}

		const verificationToken = crypto.randomUUID();

		await db.insert(emailVerificationTokens).values({
			id: verificationToken,
			accountId: account.id,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60),
		});

		await publishAuthEvent({
			topic: AUTH_TOPICS.ACCOUNT_CREATED,
			key: account.id,
			value: { accountId: account.id, email: account.email, verificationToken },
		});

		return {
			accountId: account.id,
			verificationToken,
		};
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			const pgError = error.cause as { code: string } | undefined;
			if (pgError?.code === "23505") {
				throw new ConflictError("Account already exists");
			}
		}
		throw error;
	}
};
