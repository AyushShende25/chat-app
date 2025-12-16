import { z } from "zod";

export const verifyEmailSchema = z.object({ token: z.uuid() });

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
