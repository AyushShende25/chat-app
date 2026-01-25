import { ConflictError, NotFoundError } from "@chat-app/errors";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/user";
import type { UpdateUserInput } from "../routes/me/schema";

export const getUser = async (userId: string) => {
	const [user] = await db.select().from(users).where(eq(users.id, userId));
	if (!user) {
		throw new NotFoundError("Profile not found");
	}
	return user;
};

export const getPublicUser = async (userId: string) => {
	const [user] = await db
		.select({
			id: users.id,
			username: users.username,
			displayName: users.displayName,
			avatarUrl: users.avatarUrl,
			bio: users.bio,
		})
		.from(users)
		.where(eq(users.id, userId));

	if (!user) {
		throw new NotFoundError("User not found");
	}

	return user;
};

export const getPublicUserByUsername = async (username: string) => {
	const [user] = await db
		.select({
			id: users.id,
			username: users.username,
			displayName: users.displayName,
			avatarUrl: users.avatarUrl,
			bio: users.bio,
		})
		.from(users)
		.where(eq(users.username, username));

	if (!user) {
		throw new NotFoundError("User not found");
	}

	return user;
};

export const updateUser = async (userId: string, params: UpdateUserInput) => {
	const existingUser = await getUser(userId);

	try {
		const [updatedUser] = await db
			.update(users)
			.set(params)
			.where(eq(users.id, existingUser.id))
			.returning();

		return updatedUser;
	} catch (error) {
		if (error instanceof DrizzleQueryError) {
			const pgError = error.cause as { code: string } | undefined;
			if (pgError?.code === "23505") {
				throw new ConflictError("That username is already taken");
			}
		}
		throw error;
	}
};
