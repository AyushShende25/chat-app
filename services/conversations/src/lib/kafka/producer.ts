import { createKafkaClient, createProducer } from "@chat-app/kafka";
import { env } from "../../config/env";

let producer: Awaited<ReturnType<typeof createProducer>> | null = null;

export const initKafkaProducer = async () => {
	if (producer) return producer;

	const kafka = createKafkaClient({
		clientId: "conversations-service",
		brokers: env.KAFKA_BROKERS,
	});

	producer = await createProducer(kafka.producer());

	return producer;
};

export const kafkaProducer = () => {
	if (!producer) {
		throw new Error("Kafka producer not initialized");
	}
	return producer;
};
