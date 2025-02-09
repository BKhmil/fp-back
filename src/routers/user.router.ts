import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     tags: [Users]
 *     description: Returns a list of users with pagination, sorting, and filtering options.
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *         description: Number of users per page.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         description: Filter users by name (partial match).
 *       - in: query
 *         name: age
 *         schema:
 *           type: integer
 *           minimum: 18
 *           maximum: 200
 *         description: Filter users by exact age.
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *           minimum: 18
 *           maximum: 200
 *         description: Filter users whose age is greater than or equal to this value.
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *           minimum: 18
 *           maximum: 200
 *         description: Filter users whose age is less than or equal to this value.
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
 *           enum: [name, age, createdAt]
 *           default: createdAt
 *         description: Field to sort users by.
 *     responses:
 *       200:
 *         description: Successful response with user list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/UserShortResponse"
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 name:
 *                   type: string
 *                   example: "John"
 *                   nullable: true
 *                 age:
 *                   type: integer
 *                   example: 25
 *                   nullable: true
 *                 minAge:
 *                   type: integer
 *                   example: 18
 *                   nullable: true
 *                 maxAge:
 *                   type: integer
 *                   example: 65
 *                   nullable: true
 *                 order:
 *                   type: string
 *                   enum: [asc, desc]
 *                   example: "asc"
 *                 orderBy:
 *                   type: string
 *                   enum: [name, age, createdAt]
 *                   example: "createdAt"
 *       400:
 *         description: Validation error (invalid query parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "\"page\" must be greater than or equal to 1"
 *                     - "\"limit\" must be between 1 and 100"
 *                     - "\"name\" must be a string"
 *                     - "\"name\" length must be between 1 and 50 characters"
 *                     - "\"age\" must be a number"
 *                     - "\"age\" must be between 18 and 200"
 *                     - "\"minAge\" must be a number"
 *                     - "\"minAge\" must be between 18 and 200"
 *                     - "\"maxAge\" must be a number"
 *                     - "\"maxAge\" must be between 18 and 200"
 *                     - "\"order\" must be either 'asc' or 'desc'"
 *                     - "\"orderBy\" must be one of 'name', 'age', 'createdAt'"
 *                   example: "\"age\" must be a number"
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
 *                     - "Unexpected error: user not found after authentication"
 *                   example: "Something went wrong"
 */
router.get(
  "/",
  authMiddleware.checkAccessToken,
  commonMiddleware.validateQuery(UserValidator.getListQuery),
  userController.getList,
);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Users]
 *     description: Returns the authenticated user's details.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
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
 *                     - "Unexpected error: user not found after authentication"
 *                   example: "Something went wrong"
 */
router.get("/me", authMiddleware.checkAccessToken, userController.getMe);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     description: Returns a user based on their ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Invalid ID format"
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "User not found"
 *                   example: "User not found"
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
// Stage_1, task_4: search by userId OR email -> [ userId ]
router.get(
  "/:userId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("userId"),
  userController.getUserById,
);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update current user
 *     tags: [Users]
 *     description: Allows the authenticated user to update their name and age.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               age:
 *                 type: integer
 *                 minimum: 18
 *                 maximum: 200
 *     responses:
 *       200:
 *         description: User successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Request body cannot be empty"
 *                     - "\"age\" must be greater than or equal to 18"
 *                     - "\"age\" must be less than or equal to 200"
 *                     - "\"name\" must be a string"
 *                     - "\"age\" must be a number"
 *                     - "\"name\" length must be less than or equal to 50 characters long"
 *                   example: "Request body cannot be empty"
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
 *                     - "Unexpected error: user not found after authentication"
 *                   example: "Something went wrong"
 */
router.patch(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyEmpty,
  commonMiddleware.validateBody(UserValidator.updateMe),
  userController.updateMe,
);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     description: Marks the user as deleted (soft delete).
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully deleted
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
 *                     - "Unexpected error: user not found after authentication"
 *                   example: "Something went wrong"
 */
// soft delete
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

export const userRouter = router;
