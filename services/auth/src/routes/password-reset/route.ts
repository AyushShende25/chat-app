import { Router } from "express";
import {
	forgotPasswordController,
	resetPasswordController,
} from "./controller";

const router = Router();

router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
