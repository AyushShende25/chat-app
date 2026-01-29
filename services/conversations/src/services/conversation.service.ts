import { BadRequestError } from "@chat-app/errors";
import { CONVERSATION_TOPICS } from "@chat-app/events";
import { and, count, desc, eq, inArray, lt } from "drizzle-orm";
import { db } from "../db";
import { conversationParticipants, conversations } from "../db/schema";
import { publishConversationEvent } from "../events/publish";

type CreateConversationParams = {
	type: "direct" | "group";
	authorId: string;
	participants: string[];
	title?: string;
};

export const createConversation = async ({
	authorId,
	participants,
	type,
	title,
}: CreateConversationParams) => {
	const uniqueParticipants = Array.from(
		new Set(participants.filter((id) => id !== authorId)),
	);

	// direct chat uniqueness check
	if (type === "direct") {
		if (uniqueParticipants.length !== 1) {
			throw new BadRequestError(
				"Direct conversation requires exactly 1 participant",
			);
		}
		const participantIds: string[] = [authorId, uniqueParticipants[0]!];
		// Find existing direct conversation with exactly these two users
		const existingConvo = await db
			.select({ conversationId: conversations.id })
			.from(conversations)
			.innerJoin(
				conversationParticipants,
				eq(conversations.id, conversationParticipants.conversationId),
			)
			.where(
				and(
					eq(conversations.type, "direct"),
					inArray(conversationParticipants.userId, participantIds),
				),
			)
			.groupBy(conversations.id)
			.having(eq(count(conversationParticipants.userId), 2))
			.limit(1);

		if (existingConvo.length > 0) {
			// Return existing conversation
			return existingConvo[0];
		}
	} else {
		// Group validation
		if (!title)
			throw new BadRequestError("Group conversation requires a title");
		if (uniqueParticipants.length < 1)
			throw new BadRequestError("Group requires at least one other member");
	}

	// Create new conversation
	const [conversation, allParticipants] = await db.transaction(async (tx) => {
		const [newConvo] = await tx
			.insert(conversations)
			.values({
				type,
				createdBy: authorId,
				title: type === "group" ? title : null,
			})
			.returning();

		if (!newConvo) {
			throw new Error("Failed to create conversation");
		}

		const allParticipants = [
			{
				conversationId: newConvo.id,
				userId: authorId,
				role: type === "group" ? "admin" : "member",
			},
			...uniqueParticipants.map((id) => ({
				conversationId: newConvo.id,
				userId: id,
				role: "member",
			})),
		];

		await tx.insert(conversationParticipants).values(allParticipants);

		return [newConvo, allParticipants];
	});

	await publishConversationEvent({
		topic: CONVERSATION_TOPICS.CONVERSATION_CREATED,
		key: conversation.id,
		value: { conversationId: conversation.id, type },
	});

	for (const p of allParticipants) {
		await publishConversationEvent({
			topic: CONVERSATION_TOPICS.PARTICIPANT_ADDED,
			key: conversation.id,
			value: {
				conversationId: conversation.id,
				userId: p.userId,
			},
		});
	}
	return conversation;
};

export const getConversations = async (
	userId: string,
	limit: number,
	cursor?: Date,
) => {
	return await db
		.select({
			id: conversations.id,
			type: conversations.type,
			title: conversations.title,
			lastMessageAt: conversations.lastMessageAt,
			createdAt: conversations.createdAt,
			role: conversationParticipants.role,
			joinedAt: conversationParticipants.joinedAt,
			lastReadMessageId: conversationParticipants.lastReadMessageId,
		})
		.from(conversations)
		.innerJoin(
			conversationParticipants,
			and(
				eq(conversationParticipants.conversationId, conversations.id),
				eq(conversationParticipants.userId, userId),
			),
		)
		.where(cursor ? lt(conversations.lastMessageAt, cursor) : undefined)
		.orderBy(desc(conversations.lastMessageAt))
		.limit(limit);
};
