import { Router } from "express";
import { registerController } from "./controller";

const router = Router();

router.post("/register", registerController);

export default router;
