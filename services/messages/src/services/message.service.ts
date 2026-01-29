import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "@chat-app/errors";
import { MESSAGE_TOPICS } from "@chat-app/events";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
	conversationParticipantRefs,
	conversationRefs,
	messages,
} from "../db/schema";
import { publishMessageEvent } from "../events/publish";
import type { CreateMsgInput } from "../routes/messages/schema";

export const createMsg = async (
	senderId: string,
	{
		conversationId,
		content,
		type,
		mediaUrl,
		mediaType,
		mediaSize,
		mediaMeta,
	}: CreateMsgInput,
) => {
	if (type === "text") {
		if (!content) {
			throw new BadRequestError("Text message requires content");
		}
		if (mediaUrl || mediaType || mediaSize || mediaMeta) {
			throw new BadRequestError("Text message cannot contain media");
		}
	}

	if (["image", "file", "audio", "video"].includes(type)) {
		if (!mediaUrl || !mediaType || !mediaSize) {
			throw new BadRequestError(
				"Media message requires mediaUrl, mediaType and mediaSize",
			);
		}
	}
	const [conversation] = await db
		.select()
		.from(conversationRefs)
		.where(eq(conversationRefs.id, conversationId));

	if (!conversation) {
		throw new NotFoundError("conversation not found");
	}

	const [participant] = await db
		.select()
		.from(conversationParticipantRefs)
		.where(
			and(
				eq(conversationParticipantRefs.conversationId, conversationId),
				eq(conversationParticipantRefs.userId, senderId),
			),
		);
	if (!participant) {
		throw new ForbiddenError("Not a participant");
	}

	const [msg] = await db
		.insert(messages)
		.values({
			conversationId,
			senderId,
			type,
			content,
			mediaUrl,
			mediaType,
			mediaSize,
			mediaMeta,
		})
		.returning();

	if (!msg) {
		throw new Error("Failed to create message");
	}

	await publishMessageEvent({
		topic: MESSAGE_TOPICS.MESSAGE_CREATED,
		key: conversationId,
		value: {
			messageId: msg.id,
			conversationId,
			senderId,
			type,
			content,
			mediaUrl,
			createdAt: msg.createdAt,
		},
	});

	return msg;
};
