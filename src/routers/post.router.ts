import { Router } from "express";

import { postController } from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { PostValidator } from "../validators/post.validator";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts management endpoints
 */

const router = Router();

/**
 * @swagger
 * /api/posts/{userId}:
 *   get:
 *     summary: Get a list of posts by user ID
 *     tags: [Posts]
 *     description: Retrieves a list of posts created by a specific user. This endpoint is public.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose posts are being retrieved.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of posts per page.
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         description: Filter posts by title (partial match).
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sorting order (ascending or descending).
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title]
 *           default: createdAt
 *         description: Field to sort posts by.
 *     responses:
 *       200:
 *         description: Successfully retrieved list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/PostResponse"
 *                 userId:
 *                   type: string
 *                   example: "67a91cb50a..."
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 order:
 *                   type: string
 *                   enum: [asc, desc]
 *                   example: "asc"
 *                 orderBy:
 *                   type: string
 *                   enum: [title, createdAt]
 *                   example: "createdAt"
 *                 title:
 *                   type: string
 *                   example: "New Title"
 *                   nullable: true
 *       400:
 *         description: Bad request (invalid query parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Invalid ID format"
 *                     - "\"page\" must be greater than or equal to 1"
 *                     - "\"limit\" must be between 1 and 100"
 *                     - "\"title\" must be a string"
 *                     - "\"title\" length must be less than or equal to 50 characters long"
 *                     - "\"order\" must be either 'asc' or 'desc'"
 *                     - "\"orderBy\" must be one of 'name', 'age', 'createdAt'"
 *                   example: "Invalid ID format"
 *       404:
 *         description: No posts found for the given user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No posts found for this user"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.validateQuery(PostValidator.getListQuery),
  postController.getList,
);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     description: Allows an authenticated and verified user to create a new post.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "My first post"
 *               text:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: "This is the content of my first post."
 *     responses:
 *       201:
 *         description: Post successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *       400:
 *         description: Bad request (invalid body)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "\"title\" must be a string"
 *                     - "\"title\" length must be less than or equal to 50 characters long"
 *                     - "Expected double-quoted property name in JSON at position 37"
 *                   example: "\"title\" must be a string"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Authorization required"
 *                     - "Invalid Authorization format"
 *                     - "Invalid or expired token"
 *                   example: "Authorization required"
 *       403:
 *         description: Forbidden (user is not verified)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "User must be verified to perform this action"
 *                   example: "User must be verified to perform this action"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.post(
  "/",
  authMiddleware.checkAccessToken,
  authMiddleware.checkVerifiedUser,
  commonMiddleware.validateBody(PostValidator.create),
  postController.create,
);

/**
 * @swagger
 * /api/posts/{postId}:
 *   patch:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     description: Allows an authenticated and verified user to update their own post.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "Updated post title"
 *               text:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: "Updated content of the post."
 *     responses:
 *       200:
 *         description: Post successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *       400:
 *         description: Bad request (invalid query parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Invalid ID format"
 *                     - "\"title\" must be a string"
 *                     - "\"title\" length must be less than or equal to 50 characters long"
 *                     - "\"text\" must be a string"
 *                     - "\"text\" length must be less than or equal to 2000 characters long"
 *                   example: "Invalid ID format"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Authorization required"
 *                     - "Invalid Authorization format"
 *                     - "Invalid or expired token"
 *                   example: "Authorization required"
 *       403:
 *         description: Forbidden (user is not verified)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "User must be verified to perform this action"
 *                     - "You are not allowed to access this post"
 *                   example: "User must be verified to perform this action"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Post not found"
 *                   example: "Post not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.patch(
  "/:postId",
  authMiddleware.checkAccessToken,
  authMiddleware.checkVerifiedUser,
  commonMiddleware.isIdValid("postId"),
  commonMiddleware.validateBody(PostValidator.update),
  postController.update,
);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     description: Allows an authenticated and verified user to delete their own post.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete.
 *     responses:
 *       204:
 *         description: Post successfully deleted.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Authorization required"
 *                     - "Invalid Authorization format"
 *                     - "Invalid or expired token"
 *                   example: "Authorization required"
 *       403:
 *         description: Forbidden (user is not verified)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "User must be verified to perform this action"
 *                     - "You are not allowed to access this post"
 *                   example: "User must be verified to perform this action"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Post not found"
 *                   example: "Post not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.delete(
  "/:postId",
  authMiddleware.checkAccessToken,
  authMiddleware.checkVerifiedUser,
  commonMiddleware.isIdValid("postId"),
  postController.delete,
);

export const postRouter = router;
