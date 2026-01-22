export const AUTH_TOPICS = {
	ACCOUNT_CREATED: "account.created",
	ACCOUNT_EMAIL_VERIFIED: "account.email_verified",
	ACCOUNT_PASSWORD_RESET_REQUESTED: "account.password_reset_requested",
	ACCOUNT_PASSWORD_RESET_COMPLETED: "account.password_reset_completed",
} as const;

export type AuthEventMap = {
	[AUTH_TOPICS.ACCOUNT_CREATED]: {
		accountId: string;
		email: string;
		verificationToken: string;
	};

	[AUTH_TOPICS.ACCOUNT_EMAIL_VERIFIED]: {
		accountId: string;
		email: string;
	};

	[AUTH_TOPICS.ACCOUNT_PASSWORD_RESET_REQUESTED]: {
		accountId: string;
		email: string;
		resetToken: string;
	};

	[AUTH_TOPICS.ACCOUNT_PASSWORD_RESET_COMPLETED]: {
		accountId: string;
		email: string;
	};
};
