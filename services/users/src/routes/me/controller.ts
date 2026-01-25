import type { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/require-auth";
import {
	getPublicUser,
	getPublicUserByUsername,
	getUser,
	updateUser,
} from "../../services/user.service";
import {
	accountIdSchema,
	getUserByUsernameSchema,
	updateUserSchema,
} from "./schema";

export const getMeController = async (req: AuthRequest, res: Response) => {
	const user = await getUser(req.accountId!);
	res.status(200).json({
		user,
	});
};

export const getUserController = async (req: Request, res: Response) => {
	const { id } = accountIdSchema.parse(req.params);

	const user = await getPublicUser(id);

	res.status(200).json({
		user,
	});
};

export const getUserByUsernameController = async (
	req: Request,
	res: Response,
) => {
	const { username } = getUserByUsernameSchema.parse(req.params);

	const user = await getPublicUserByUsername(username);

	res.status(200).json({ user });
};

export const updateMeController = async (req: AuthRequest, res: Response) => {
	const updateInput = updateUserSchema.parse(req.body);

	const user = await updateUser(req.accountId!, updateInput);

	res.status(200).json({
		user,
	});
};
