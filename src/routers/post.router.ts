import { Router } from "express";

import { postController } from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { PostValidator } from "../validators/post.validator";

const router = Router();

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.validateQuery(PostValidator.getListQuery),
  postController.getList,
);

router.post(
  "/",
  authMiddleware.checkAccessToken,
  authMiddleware.checkVerifiedUser,
  commonMiddleware.validateBody(PostValidator.create),
  postController.create,
);

router.patch(
  "/:postId",
  authMiddleware.checkAccessToken,
  authMiddleware.checkVerifiedUser,
  commonMiddleware.isIdValid("postId"),
  commonMiddleware.validateBody(PostValidator.update),
  postController.update,
);

router.delete(
  "/:postId",
  authMiddleware.checkAccessToken,
  authMiddleware.checkVerifiedUser,
  commonMiddleware.isIdValid("postId"),
  postController.delete,
);

export const postRouter = router;
