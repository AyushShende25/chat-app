import type { AuthEventMap } from "@chat-app/events";
import { kafkaProducer } from "../lib/kafka/producer";

export const publishAuthEvent = async <T extends keyof AuthEventMap>(params: {
	topic: T;
	key: string;
	value: AuthEventMap[T];
}) => {
	const producer = kafkaProducer();
	await producer.publish({
		topic: params.topic,
		key: params.key,
		value: params.value,
	});
};
