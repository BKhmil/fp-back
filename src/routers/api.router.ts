import { Router } from "express";

import { authRouter } from "./auth.router";
import { postRouter } from "./post.router";
import { userRouter } from "./user.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);

export const apiRouter = router;
