import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", authMiddleware.checkAccessToken, userController.getList);

router.get("/me", authMiddleware.checkAccessToken, userController.getMe);

router.patch(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyEmpty,
  commonMiddleware.validateBody(UserValidator.updateMe),
  userController.updateMe,
);

// soft delete
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getUserById,
);

export const userRouter = router;
