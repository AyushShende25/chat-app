import { eq } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema/account";
import { passwordResetTokens } from "../db/schema/password-reset";
import type { ForgotPasswordInput } from "./../routes/password-reset/schema";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60;

export const forgotPassword = async (
	forgotPasswordInput: ForgotPasswordInput,
) => {
	const [account] = await db
		.select()
		.from(accounts)
		.where(eq(accounts.email, forgotPasswordInput.email));

	if (!account || !account.isActive) {
		return;
	}

	const token = crypto.randomUUID();

	await db.insert(passwordResetTokens).values({
		id: token,
		accountId: account.id,
		expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
	});

	// TODO: Send Reset Password link
};
