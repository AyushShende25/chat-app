import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import {
	addParticipantController,
	createConversationController,
	getConversationController,
	leaveConversationController,
	listMyConversationsController,
	removeParticipantController,
} from "./controller";

const router = Router();

router.get("/", requireAuth, listMyConversationsController);

router.post("/", requireAuth, createConversationController);

router.get("/:id", getConversationController);
router.post("/:id/participants", requireAuth, addParticipantController);
router.delete(
	"/:id/participants/:userId",
	requireAuth,
	removeParticipantController,
);
router.post("/:id/leave", leaveConversationController);

export default router;
