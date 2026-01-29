import { Router } from "express";
import conversationsRoute from "./conversations/route";

const router = Router();

router.use(conversationsRoute);

export default router;
