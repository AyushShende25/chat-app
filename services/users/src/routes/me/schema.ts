import * as z from "zod";

export const accountIdSchema = z.object({ id: z.uuid() });

export const getUserByUsernameSchema = z.object({
	username: z.string(),
});

export const updateUserSchema = z
	.object({
		username: z.string().trim().toLowerCase().max(50),
		displayName: z.string().trim().toLowerCase().max(100),
		avatarUrl: z.url().max(500),
		bio: z.string().trim().max(500),
	})
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided",
	});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
