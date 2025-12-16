import { BadRequestError, UnauthorizedError } from "@chat-app/errors";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema/account";
import type { LoginInput } from "./../routes/login/schema";
import { verifyPassword } from "../utils/password";

export const loginAccount = async (loginInput: LoginInput) => {
	const [account] = await db
		.select()
		.from(accounts)
		.where(eq(accounts.email, loginInput.email));

	if (!account) {
		throw new UnauthorizedError("Invalid credentials");
	}

	if (!account.isActive) {
		throw new UnauthorizedError("Account disabled");
	}

	if (!account.isEmailVerified) {
		throw new BadRequestError("Email not verified");
	}

	if (!account.passwordHash) {
		throw new UnauthorizedError("Invalid credentials");
	}

	const valid = await verifyPassword(account.passwordHash, loginInput.password);

	if (!valid) {
		throw new UnauthorizedError("Invalid credentials");
	}

	return {
		accountId: account.id,
	};
};
