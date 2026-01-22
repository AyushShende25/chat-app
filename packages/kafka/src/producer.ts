import type { Producer } from "kafkajs";
import type { KafkaEvent } from "./types";

export const createProducer = async (producer: Producer) => {
	await producer.connect();

	return {
		publish: async <T>(event: KafkaEvent<T>) => {
			await producer.send({
				topic: event.topic,
				messages: [
					{
						key: event.key,
						value: JSON.stringify(event.value),
					},
				],
			});
		},
		disconnect: async () => {
			await producer.disconnect();
		},
	};
};
