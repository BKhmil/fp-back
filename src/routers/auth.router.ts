import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.validateBody(UserValidator.signUp),
  authMiddleware.checkEmail(true),
  authController.signUp,
);
router.post(
  "/sign-in",
  commonMiddleware.validateBody(UserValidator.signIn),
  authMiddleware.checkEmail(),
  authController.signIn,
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);
router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

router.post(
  "/forgot-password",
  commonMiddleware.validateBody(UserValidator.forgotPassword),
  authController.forgotPassword,
);
router.put(
  "/forgot-password",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
  authMiddleware.checkNewPasswordIsUnique(),
  authController.forgotPasswordSet,
);

router.put(
  "/change-password",
  commonMiddleware.validateBody(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authMiddleware.checkNewPasswordIsUnique(true),
  authController.changePassword,
);

router.put(
  "/verify-email",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY_EMAIL),
  authController.verify,
);

export const authRouter = router;
