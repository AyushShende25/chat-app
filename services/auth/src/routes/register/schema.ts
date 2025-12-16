import { z } from "zod";

export const registerSchema = z.object({
	email: z.email().trim().toLowerCase(),
	password: z.string().trim().min(8).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
