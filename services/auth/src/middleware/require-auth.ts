import { UnauthorizedError } from "@chat-app/errors";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AccessTokenPayload = {
	sub: string;
};

export const requireAuth = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const header = req.headers.authorization;

	if (!header?.startsWith("Bearer ")) {
		throw new UnauthorizedError("Missing access token");
	}

	const token = header.slice(7);

	try {
		const payload = jwt.verify(
			token,
			env.JWT_ACCESS_SECRET,
		) as AccessTokenPayload;

		(req as any).accountId = payload.sub;
		next();
	} catch {
		throw new UnauthorizedError("Invalid access token");
	}
};
