import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { sendMessageController } from "./controller";

const router = Router();

router.post("/", requireAuth, sendMessageController);

export default router;
