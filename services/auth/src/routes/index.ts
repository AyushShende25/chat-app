import { Router } from "express";
import registerRoute from "./register/route";
import verifyEmailRoute from "./verify-email/route";

const router = Router();

router.use(registerRoute);
router.use(verifyEmailRoute);

export default router;
