import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import {
	getMeController,
	getUserByUsernameController,
	getUserController,
	updateMeController,
} from "./controller";

const router = Router();

router.get("/me", requireAuth, getMeController);

router.patch("/me", requireAuth, updateMeController);

router.get("/by-username/:username", getUserByUsernameController);

router.get("/:id", getUserController);

export default router;
