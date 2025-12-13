import type { Logger } from "@chat-app/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import { env } from "./config/env";
import morganMiddleware from "./middleware/morgan";

export const createApp = (logger: Logger): Application => {
	const app = express();
	app.use(helmet());
	app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
	app.use(cookieParser());
	app.use(morganMiddleware(logger));
	app.use(express.json({ limit: "100kb" }));
	app.get("/health", (_req, res) => {
		res.json({ success: true, message: "OK" });
	});

	return app;
};
