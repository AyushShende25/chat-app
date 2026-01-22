import { AUTH_TOPICS, type AuthEventMap } from "@chat-app/events";
import { env } from "../config/env";
import { kafkaConsumer } from "../lib/kafka/consumer";
import { sendMail } from "../lib/mailer";
import { passwordResetTemplate } from "../templates/password-reset";
import { passwordResetSuccessTemplate } from "../templates/password-reset-success";
import { verifyEmailTemplate } from "../templates/verify-email";
import { emailVerifiedTemplate } from "../templates/verify-success";

export const startAuthEventsConsumer = async () => {
	const consumer = kafkaConsumer();

	await consumer.subscribe<AuthEventMap["account.created"]>(
		AUTH_TOPICS.ACCOUNT_CREATED,
		async (event) => {
			const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${event.verificationToken}`;

			await sendMail({
				to: event.email,
				subject: "Verify your email",
				html: verifyEmailTemplate({ verifyUrl }),
			});
		},
	);

	await consumer.subscribe<AuthEventMap["account.email_verified"]>(
		AUTH_TOPICS.ACCOUNT_EMAIL_VERIFIED,
		async (event) => {
			await sendMail({
				to: event.email,
				subject: "Email verified",
				html: emailVerifiedTemplate(),
			});
		},
	);

	await consumer.subscribe<AuthEventMap["account.password_reset_requested"]>(
		AUTH_TOPICS.ACCOUNT_PASSWORD_RESET_REQUESTED,
		async (event) => {
			const resetUrl = `${env.CLIENT_URL}/reset-password?token=${event.resetToken}`;

			await sendMail({
				to: event.email,
				subject: "Reset your password",
				html: passwordResetTemplate({ resetUrl }),
			});
		},
	);

	await consumer.subscribe<AuthEventMap["account.password_reset_completed"]>(
		AUTH_TOPICS.ACCOUNT_PASSWORD_RESET_COMPLETED,
		async (event) => {
			await sendMail({
				to: event.email,
				subject: "Your password was changed",
				html: passwordResetSuccessTemplate(),
			});
		},
	);

	await consumer.start();
};
