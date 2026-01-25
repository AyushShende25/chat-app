import { AUTH_TOPICS, type AuthEventMap } from "@chat-app/events";
import { db } from "../db";
import { users } from "../db/schema/user";
import { kafkaConsumer } from "../lib/kafka/consumer";
import { generateUsername } from "../utils/username";

export const startAuthEventsConsumer = async () => {
	const consumer = kafkaConsumer();

	await consumer.subscribe<AuthEventMap["account.created"]>(
		AUTH_TOPICS.ACCOUNT_CREATED,
		async (event) => {
			const username = generateUsername(event.email);
			await db
				.insert(users)
				.values({
					id: event.accountId,
					username: username,
					displayName: username,
				})
				.onConflictDoNothing();
		},
	);

	await consumer.start();
};
