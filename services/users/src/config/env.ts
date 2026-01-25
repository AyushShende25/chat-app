import * as z from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]),
	PORT: z.coerce.number().default(3002),
	SERVICE_NAME: z.string().default("users"),
	LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),
	CLIENT_URL: z.url(),
	JWT_ACCESS_SECRET: z.string(),
	DATABASE_URL: z.url(),
	KAFKA_BROKERS: z
		.string()
		.transform((val) => val.split(",").map((s) => s.trim())),
});

const parsedSchema = envSchema.safeParse(process.env);

if (!parsedSchema.success) {
	console.error("Invalid environment variables");
	console.error(z.prettifyError(parsedSchema.error));
	process.exit(1);
}

export const env = parsedSchema.data;
