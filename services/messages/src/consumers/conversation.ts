import {
	CONVERSATION_TOPICS,
	type ConversationEventMap,
} from "@chat-app/events";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { conversationParticipantRefs, conversationRefs } from "../db/schema";
import { kafkaConsumer } from "../lib/kafka/consumer";

export const startConversationConsumer = async () => {
	const consumer = kafkaConsumer();

	await consumer.subscribe<ConversationEventMap["conversation.created"]>(
		CONVERSATION_TOPICS.CONVERSATION_CREATED,
		async (event) => {
			await db.insert(conversationRefs).values({
				id: event.conversationId,
				type: event.type,
			});
		},
	);

	await consumer.subscribe<
		ConversationEventMap["conversation.participant_added"]
	>(CONVERSATION_TOPICS.PARTICIPANT_ADDED, async (event) => {
		await db.insert(conversationParticipantRefs).values({
			conversationId: event.conversationId,
			userId: event.userId,
		});
	});

	await consumer.subscribe<
		ConversationEventMap["conversation.participant_removed"]
	>(CONVERSATION_TOPICS.PARTICIPANT_REMOVED, async (event) => {
		await db
			.delete(conversationParticipantRefs)
			.where(
				and(
					eq(conversationParticipantRefs.conversationId, event.conversationId),
					eq(conversationParticipantRefs.userId, event.userId),
				),
			);
	});

	await consumer.start();
};
