import { Kafka } from "kafkajs";

export const createKafkaClient = (options: {
	clientId: string;
	brokers: string[];
}) => {
	return new Kafka({
		clientId: options.clientId,
		brokers: options.brokers,
		retry: {
			retries: 5,
		},
	});
};
