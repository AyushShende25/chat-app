import type { Request, Response } from "express";
import { verifyEmail } from "../../services/verify-email.service";
import { verifyEmailSchema } from "./schema";

export const verifyEmailController = async (req: Request, res: Response) => {
	const { token } = verifyEmailSchema.parse(req.query);

	await verifyEmail({ token });

	res.status(200).json({
		message: "Email verified successfully",
	});
};
