import crypto from "node:crypto";

export const generateUsername = (email: string) => {
	let base = email.split("@")[0];
	base = base?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
	const suffix = crypto.randomInt(1000, 9999);

	return `${base}_${suffix}`;
};
