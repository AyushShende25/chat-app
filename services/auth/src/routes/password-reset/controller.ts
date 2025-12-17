import type { Request, Response } from "express";
import { forgotPassword } from "../../services/forgot-password.service";
import { resetPassword } from "../../services/reset-password.service";
import { forgotPasswordSchema, resetPasswordSchema } from "./schema";

export const forgotPasswordController = async (req: Request, res: Response) => {
	const { email } = forgotPasswordSchema.parse(req.body);

	await forgotPassword({ email });

	res.status(200).json({
		message: "If the email exists, a reset link has been sent",
	});
};

export const resetPasswordController = async (req: Request, res: Response) => {
	const { token, password } = resetPasswordSchema.parse(req.body);

	await resetPassword({ token, password });

	res.status(200).json({
		message: "Password updated successfully",
	});
};
