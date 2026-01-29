import { MESSAGE_TOPICS, type MessageEventMap } from "@chat-app/events";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { conversations } from "../db/schema";
import { kafkaConsumer } from "../lib/kafka/consumer";

export const startMessageConsumer = async () => {
	const consumer = kafkaConsumer();
	await consumer.subscribe<MessageEventMap["message.created"]>(
		MESSAGE_TOPICS.MESSAGE_CREATED,
		async (event) => {
			await db
				.update(conversations)
				.set({ lastMessageAt: event.createdAt })
				.where(eq(conversations.id, event.conversationId));
		},
	);
	await consumer.start();
};
