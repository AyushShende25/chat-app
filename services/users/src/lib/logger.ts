import { createLogger } from "@chat-app/logger";
import { env } from "../config/env";

export const logger = createLogger(env.SERVICE_NAME);
