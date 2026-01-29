import { Router } from "express";
import messagesRoute from "./messages/route";

const router = Router();

router.use(messagesRoute);

export default router;
