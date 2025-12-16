import { Router } from "express";
import { verifyEmailController } from "./controller";

const router = Router();

router.post("/verify-email", verifyEmailController);

export default router;
