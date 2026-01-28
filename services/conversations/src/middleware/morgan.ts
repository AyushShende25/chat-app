import type { Logger } from "@chat-app/logger";
import morgan, { type StreamOptions } from "morgan";
import { env } from "../config/env";

const morganMiddleware = (logger: Logger) => {
	const stream: StreamOptions = {
		write: (message) => logger.http(message.trim()),
	};

	const skip = () => env.NODE_ENV !== "development";

	return morgan(
		":method :url :status :res[content-length] - :response-time ms",
		{ stream, skip },
	);
};

export default morganMiddleware;
