import { createConsumer, createKafkaClient } from "@chat-app/kafka";
import { env } from "../../config/env";

let consumer: Awaited<ReturnType<typeof createConsumer>> | null = null;

export const initKafkaConsumer = async () => {
	if (consumer) return consumer;

	const kafka = createKafkaClient({
		clientId: "conversations-service",
		brokers: env.KAFKA_BROKERS,
	});

	consumer = await createConsumer(
		kafka.consumer({ groupId: "conversations-service-group" }),
	);

	return consumer;
};

export const kafkaConsumer = () => {
	if (!consumer) {
		throw new Error("Kafka consumer not initialized");
	}
	return consumer;
};
