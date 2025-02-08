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
  "/account-restore",
  commonMiddleware.validateBody(UserValidator.accountRestore),
  authController.accountRestore,
);
router.put(
  "/account-restore",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.ACCOUNT_RESTORE),
  // at this point user can set the old one password
  authController.accountRestoreSet,
);

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);
router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post(
  "/forgot-password",
  commonMiddleware.validateBody(UserValidator.forgotPassword),
  authController.forgotPassword,
);
router.put(
  "/forgot-password",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
  authController.forgotPasswordSet,
);

router.put(
  "/change-password",
  commonMiddleware.validateBody(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword,
);

router.post(
  "/verify-email",
  // TODO: validate req.body.token
  authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY_EMAIL),
  authController.verify,
);

// TODO: resend-verification endpoint

export const authRouter = router;
