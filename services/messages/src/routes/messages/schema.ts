import * as z from "zod";

export const createMessageSchema = z.object({
	conversationId: z.uuid(),
	type: z.enum(["text", "file", "image", "audio", "video"]).default("text"),
	content: z.string().optional(),

	mediaUrl: z.url().optional(),
	mediaType: z.string().max(100).optional(),
	mediaSize: z.number().optional(),
	mediaMeta: z.record(z.any(), z.any()).optional(),
});

export type CreateMsgInput = z.infer<typeof createMessageSchema>;
