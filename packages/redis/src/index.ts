import { createClient, type RedisClientType } from "redis";

export type RedisClient = RedisClientType;

export const createRedisClient = async (url: string): Promise<RedisClient> => {
	const client: RedisClient = createClient({ url });

	client.on("connect", () => {
		console.log("[redis] connected");
	});

	client.on("error", (err) => {
		console.error("[redis] error:", err);
	});

	await client.connect();
	return client;
};
