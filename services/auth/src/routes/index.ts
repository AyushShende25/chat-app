import { Router } from "express";
import loginRoute from "./login/route";
import logoutRoute from "./logout/route";
import refreshRoute from "./refresh/route";
import registerRoute from "./register/route";
import verifyEmailRoute from "./verify-email/route";

const router = Router();

router.use(registerRoute);
router.use(verifyEmailRoute);
router.use(loginRoute);
router.use(refreshRoute);
router.use(logoutRoute);

export default router;
