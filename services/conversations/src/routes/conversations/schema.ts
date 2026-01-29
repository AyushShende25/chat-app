import * as z from "zod";

export const createConversationSchema = z.object({
	type: z.enum(["direct", "group"]),
	title: z.string().max(100).optional(),
	participants: z.array(z.uuid()),
});

export const getConversationsSchema = z.object({
	cursor: z.coerce.date().optional(),
	limit: z.coerce.number().default(20),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
