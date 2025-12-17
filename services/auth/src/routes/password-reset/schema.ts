import * as z from "zod";

export const forgotPasswordSchema = z.object({
	email: z.email().trim().toLowerCase(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
	token: z.uuid(),
	password: z.string().trim().min(8).max(72),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
