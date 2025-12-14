import * as z from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]),
	PORT: z.coerce.number().default(5000),
	SERVICE_NAME: z.string().default("auth"),
	LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),
	CLIENT_URL: z.url(),
	REDIS_URL: z.url(),
	DATABASE_URL: z.url(),
});

const parsedSchema = envSchema.safeParse(process.env);

if (!parsedSchema.success) {
	console.error("Invalid environment variables");
	console.error(z.prettifyError(parsedSchema.error));
	process.exit(1);
}

export const env = parsedSchema.data;
