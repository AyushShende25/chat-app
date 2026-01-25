import { Router } from "express";
import meRoute from "./me/route";

const router = Router();

router.use(meRoute);

export default router;
