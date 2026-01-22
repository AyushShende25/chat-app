import nodemailer from "nodemailer";
import { env } from "../config/env";

export const mailer = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: env.NODE_ENV === "production",
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
	},
});

export const sendMail = async (params: {
	to: string;
	subject: string;
	html: string;
}) => {
	await mailer.sendMail({
		from: `"Chat App" <${env.SMTP_USER}>`,
		to: params.to,
		subject: params.subject,
		html: params.html,
	});
};
