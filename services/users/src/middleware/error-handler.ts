import { AppError } from "@chat-app/errors";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (err instanceof ZodError) {
		return res.status(422).json({
			errors: err.issues.map((issue) => ({
				message: issue.message,
				...(issue.path.length > 0 && { path: issue.path.join(".") }),
			})),
		});
	}

	if (err instanceof AppError) {
		return res.status(err.statusCode).json(err.serialize());
	}

	logger.error("Unhandled error", err as Error);

	return res.status(500).json([{ message: "Something went wrong" }]);
};
