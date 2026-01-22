export type KafkaEvent<T = unknown> = {
	topic: string;
	key?: string;
	value: T;
};
