import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get(
  "/",
  authMiddleware.checkAccessToken,
  commonMiddleware.validateQuery(UserValidator.getListQuery),
  userController.getList,
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Unexpected error (user not found after authentication)
 */
router.get("/me", authMiddleware.checkAccessToken, userController.getMe);

// Stage_1, task_4: search by userId OR email -> [ userId ]
router.get(
  "/:userId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("userId"),
  userController.getUserById,
);

router.patch(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyEmpty,
  commonMiddleware.validateBody(UserValidator.updateMe),
  userController.updateMe,
);

// soft delete
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

export const userRouter = router;
