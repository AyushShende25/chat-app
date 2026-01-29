import type { ConversationEventMap } from "@chat-app/events";
import { kafkaProducer } from "../lib/kafka/producer";

export const publishConversationEvent = async <
	T extends keyof ConversationEventMap,
>(params: {
	topic: T;
	key: string;
	value: ConversationEventMap[T];
}) => {
	const producer = kafkaProducer();
	await producer.publish({
		topic: params.topic,
		key: params.key,
		value: params.value,
	});
};
