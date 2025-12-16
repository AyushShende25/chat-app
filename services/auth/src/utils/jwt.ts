import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AccessTokenPayload = {
	sub: string;
};

export const signAccessToken = (accountId: string) => {
	const payload: AccessTokenPayload = {
		sub: accountId,
	};

	return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
		expiresIn: env.JWT_ACCESS_TTL,
	});
};
