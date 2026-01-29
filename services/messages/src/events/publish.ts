import type { MessageEventMap } from "@chat-app/events";
import { kafkaProducer } from "../lib/kafka/producer";

export const publishMessageEvent = async <
	T extends keyof MessageEventMap,
>(params: {
	topic: T;
	key: string;
	value: MessageEventMap[T];
}) => {
	const producer = kafkaProducer();
	await producer.publish({
		topic: params.topic,
		key: params.key,
		value: params.value,
	});
};
