export const CONVERSATION_TOPICS = {
	CONVERSATION_CREATED: "conversation.created",
	PARTICIPANT_ADDED: "conversation.participant_added",
	PARTICIPANT_REMOVED: "conversation.participant_removed",
} as const;

export type ConversationEventMap = {
	[CONVERSATION_TOPICS.CONVERSATION_CREATED]: {
		conversationId: string;
		type: string;
	};

	[CONVERSATION_TOPICS.PARTICIPANT_ADDED]: {
		conversationId: string;
		userId: string;
	};

	[CONVERSATION_TOPICS.PARTICIPANT_REMOVED]: {
		conversationId: string;
		userId: string;
	};
};
