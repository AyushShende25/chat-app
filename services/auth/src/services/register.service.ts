import { ConflictError } from "@chat-app/errors";
import { AUTH_TOPICS } from "@chat-app/events";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema/account";
import { emailVerificationTokens } from "../db/schema/email-verification";
import { publishAuthEvent } from "../events/publish";
import type { RegisterInput } from "../routes/register/schema";
import { hashPassword } from "../utils/password";

export const registerAccount = async (registerInput: RegisterInput) => {
	const { email, password } = registerInput;
	const existingAcc = await db
		.select()
		.from(accounts)
		.where(eq(accounts.email, email));
	console.log(existingAcc, "e");

	if (existingAcc.length > 0) {
		throw new ConflictError("Account already exists");
	}

	const passwordHash = await hashPassword(password);

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
};
