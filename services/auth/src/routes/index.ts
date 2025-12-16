import { Router } from "express";
import registerRoute from "./register/route";

const router = Router();

router.use(registerRoute);

export default router;
