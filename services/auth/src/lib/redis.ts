import { createRedisClient, type RedisClient } from "@chat-app/redis";
import { env } from "../config/env";
import { logger } from "./logger";

let client: RedisClient | null = null;

export const initRedis = async () => {
	if (client) return client;

	logger.info("Connecting to Redis...");

	client = await createRedisClient(env.REDIS_URL);

	logger.info("Redis connected");

	return client;
};

export const redis = (): RedisClient => {
	if (!client) {
		throw new Error("Redis client not initialized");
	}
	return client;
};
