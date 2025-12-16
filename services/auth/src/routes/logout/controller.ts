import type { Request, Response } from "express";
import { refreshTokenStore } from "../../store/refresh-token.store";

export const logoutController = async (req: Request, res: Response) => {
	const refreshTokenId = req.cookies?.refresh_token;

	if (refreshTokenId) {
		await refreshTokenStore.revoke(refreshTokenId);
	}

	res.clearCookie("refresh_token", {
		path: "/auth/refresh",
	});

	res.status(204).json();
};

export const logoutAllController = async (req: Request, res: Response) => {
	const accountId = (req as any).accountId as string;

	await refreshTokenStore.revokeAll(accountId);

	res.clearCookie("refresh_token", {
		path: "/auth/refresh",
	});

	res.status(204).json();
};
