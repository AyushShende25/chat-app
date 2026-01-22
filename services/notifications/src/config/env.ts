import * as z from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]),
	KAFKA_BROKERS: z
		.string()
		.transform((val) => val.split(",").map((s) => s.trim())),
	SMTP_HOST: z.string(),
	SMTP_PORT: z.coerce.number(),
	SMTP_USER: z.string(),
	SMTP_PASS: z.string(),
	CLIENT_URL: z.url(),
	SERVICE_NAME: z.string().default("notifications"),
});

const parsedSchema = envSchema.safeParse(process.env);

if (!parsedSchema.success) {
	console.error("Invalid environment variables");
	console.error(z.prettifyError(parsedSchema.error));
	process.exit(1);
}

export const env = parsedSchema.data;
