import type { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/require-auth";
import {
	createConversation,
	getConversations,
} from "../../services/conversation.service";
import { createConversationSchema, getConversationsSchema } from "./schema";

export const createConversationController = async (
	req: AuthRequest,
	res: Response,
) => {
	const input = createConversationSchema.parse(req.body);
	const conversation = await createConversation({
		type: input.type,
		title: input.title,
		participants: input.participants,
		authorId: req.accountId!,
	});

	res.status(201).json(conversation);
};

export const listMyConversationsController = async (
	req: AuthRequest,
	res: Response,
) => {
	const { limit, cursor } = getConversationsSchema.parse(req.query);
	const conversations = await getConversations(req.accountId!, limit, cursor);

	res.status(200).json({
		conversations,
		nextCursor:
			conversations.length > 0
				? conversations[conversations.length - 1]?.lastMessageAt
				: null,
	});
};

export const getConversationController = async (
	req: Request,
	res: Response,
) => {};

export const addParticipantController = async (
	req: Request,
	res: Response,
) => {};
export const removeParticipantController = async (
	req: Request,
	res: Response,
) => {};
export const leaveConversationController = async (
	req: Request,
	res: Response,
) => {};
