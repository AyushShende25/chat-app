import { Router } from "express";
import { refreshController } from "./controller";

const router = Router();

router.post("/refresh", refreshController);

export default router;
