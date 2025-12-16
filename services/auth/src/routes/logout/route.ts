import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { logoutAllController, logoutController } from "./controller";

const router = Router();

router.post("/logout", logoutController);
router.post("/logout-all", requireAuth, logoutAllController);

export default router;
