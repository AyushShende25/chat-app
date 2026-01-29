export const MESSAGE_TOPICS = { MESSAGE_CREATED: "message.created" } as const;

export type MessageEventMap = {
	[MESSAGE_TOPICS.MESSAGE_CREATED]: {
		messageId: string;
		conversationId: string;
		senderId: string;
		type: string;
		content?: string;
		mediaUrl?: string;
		createdAt: Date;
	};
};
