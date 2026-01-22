import type { Consumer } from "kafkajs";

type Handler<T> = (payload: T) => Promise<void>;

export const createConsumer = async (consumer: Consumer) => {
	await consumer.connect();

	const handlers = new Map<string, Handler<any>>();

	let running = false;
	return {
		subscribe: async <T>(topic: string, handler: Handler<T>) => {
			if (running) {
				throw new Error("Cannot subscribe after consumer has started");
			}

			await consumer.subscribe({
				topic,
				fromBeginning: false,
			});

			handlers.set(topic, handler);
		},
		start: async () => {
			if (running) return;
			running = true;

			await consumer.run({
				eachMessage: async ({ topic, message }) => {
					if (!message.value) return;

					const handler = handlers.get(topic);
					if (!handler) return;

					const payload = JSON.parse(message.value.toString());

					await handler(payload);
				},
			});
		},
		disconnect: async () => {
			await consumer.disconnect();
		},
	};
};
