import crypto from "node:crypto";
import { env } from "../config/env";
import { redis } from "../lib/redis";

const refreshTokenKey = (tokenId: string) => `refresh-token:${tokenId}`;

const activeTokensKey = (accountId: string) =>
	`active-refresh-tokens:${accountId}`;

export const refreshTokenStore = {
	generateTokenId(): string {
		return crypto.randomUUID();
	},

	async store(
		accountId: string,
		tokenId: string,
		ttlSeconds = env.REFRESH_TOKEN_TTL_SECONDS,
	) {
		await redis().set(refreshTokenKey(tokenId), accountId, {
			expiration: { type: "EX", value: ttlSeconds },
		});

		await redis().sAdd(activeTokensKey(accountId), tokenId);
		await redis().expire(activeTokensKey(accountId), ttlSeconds);
	},

	async validate(tokenId: string): Promise<string | null> {
		return redis().get(refreshTokenKey(tokenId));
	},

	async revoke(tokenId: string) {
		const accountId = await redis().get(refreshTokenKey(tokenId));
		if (accountId) {
			await redis().sRem(activeTokensKey(accountId), tokenId);
		}
		await redis().del(refreshTokenKey(tokenId));
	},

	async revokeAll(accountId: string) {
		const tokens = await redis().sMembers(activeTokensKey(accountId));
		if (tokens.length) {
			await redis().del(tokens.map(refreshTokenKey));
		}
		await redis().del(activeTokensKey(accountId));
	},
};
