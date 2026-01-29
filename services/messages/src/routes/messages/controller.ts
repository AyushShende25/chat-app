import type { Response } from "express";
import type { AuthRequest } from "../../middleware/require-auth";
import { createMsg } from "../../services/message.service";
import { createMessageSchema } from "./schema";

export const sendMessageController = async (
	req: AuthRequest,
	res: Response,
) => {
	const input = createMessageSchema.parse(req.body);

	const msg = await createMsg(req.accountId!, input);

	res.status(201).json(msg);
};
