import { AUTH_TOPICS, type AuthEventMap } from "@chat-app/events";
import { kafkaConsumer } from "../lib/kafka/consumer";
import { refreshTokenStore } from "../store/refresh-token.store";

export const startSecurityConsumer = async () => {
	const consumer = kafkaConsumer();

	await consumer.subscribe<AuthEventMap["account.password_reset_completed"]>(
		AUTH_TOPICS.ACCOUNT_PASSWORD_RESET_COMPLETED,
		async (event) => {
			await refreshTokenStore.revokeAll(event.accountId);
		},
	);

	await consumer.start();
};
