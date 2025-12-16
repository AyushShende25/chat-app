import type { Request, Response } from "express";
import { env } from "../../config/env";
import { loginAccount } from "../../services/login.service";
import { refreshTokenStore } from "../../store/refresh-token.store";
import { signAccessToken } from "../../utils/jwt";
import { loginSchema } from "./schema";

export const loginController = async (req: Request, res: Response) => {
	const { email, password } = loginSchema.parse(req.body);

	const { accountId } = await loginAccount({ email, password });

	const accessToken = signAccessToken(accountId);

	const refreshTokenId = refreshTokenStore.generateTokenId();
	await refreshTokenStore.store(accountId, refreshTokenId);

	res.cookie("refresh_token", refreshTokenId, {
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
