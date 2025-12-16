import type { Request, Response } from "express";
import { registerAccount } from "../../services/register.service";
import { registerSchema } from "./schema";

export const registerController = async (req: Request, res: Response) => {
	const { email, password } = registerSchema.parse(req.body);

	await registerAccount({ email, password });

	res.status(201).json({
		message: "Account created. Please verify your email.",
	});
};
