import { UnauthorizedError } from "@chat-app/errors";
import type { Request, Response } from "express";
import { env } from "../../config/env";
import { refreshTokenStore } from "../../store/refresh-token.store";
import { signAccessToken } from "../../utils/jwt";

export const refreshController = async (req: Request, res: Response) => {
	const refreshTokenId = req.cookies?.refresh_token;

	if (!refreshTokenId) {
		throw new UnauthorizedError("Missing refresh token");
	}

	const accountId = await refreshTokenStore.validate(refreshTokenId);

	if (!accountId) {
		res.clearCookie("refresh_token", {
			path: "/auth/refresh",
		});
		throw new UnauthorizedError("Invalid refresh token");
	}

	await refreshTokenStore.revoke(refreshTokenId);

	const newRefreshTokenId = refreshTokenStore.generateTokenId();

	await refreshTokenStore.store(accountId, newRefreshTokenId);

	const accessToken = signAccessToken(accountId);

	res.cookie("refresh_token", newRefreshTokenId, {
		httpOnly: true,
		secure: env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/auth/refresh",
		maxAge: env.REFRESH_TOKEN_TTL_SECONDS * 1000,
	});

	res.status(200).json({
		accessToken,
	});
};
