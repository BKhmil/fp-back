import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management endpoints
 */

const router = Router();

/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Creates a new user account and sends a verification email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "John Doe"
 *               age:
 *                 type: integer
 *                 minimum: 18
 *                 maximum: 200
 *                 example: 25
 *               email:
 *                 type: string
 *                 format: email
 *                 pattern: '^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$'
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 pattern: '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$'
 *                 example: "Secure@123"
 *     responses:
 *       200:
 *        description: Success, but user is not created.
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 canRestore:
 *                   type: boolean
 *       201:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SignInResponse"
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
 *                     - "Request body cannot be empty"
 *                     - "\"age\" must be greater than or equal to 18"
 *                     - "\"age\" must be less than or equal to 200"
 *                     - "\"name\" must be a string"
 *                     - "\"age\" must be a number"
 *                     - "\"name\" length must be less than or equal to 50 characters long"
 *                     - "\"name\" is required"
 *                     - "\"age\" is required"
 *                     - "\"email\" is required"
 *                     - "\"password\" is required"
 *                     - "\"email\" with value \"user_testgmail.com\" fails to match the required pattern: /^[^\\s@]+@([^\\s@.,]+\\.)+[^\\s@.,]{2,}$/"
 *                     - "\"password\" with value \"fffff11111\" fails to match the required pattern: /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%_*#?&])[A-Za-z\\d@$_!%*#?&]{8,}$/"
 *                     - "Expected double-quoted property name in JSON at position 37"
 *                   example: "\"age\" must be a number"
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Email is already in use"
 *                   example: "Email is already in use"
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
 *                     - "Invalid token type"
 *                     - "Something went wrong"
 *                     - "Unknown email type"
 *                     - "Failed to send email: [DETAILED_ERROR.MESSAGE]"
 *                   example: "Something went wrong"
 */
router.post(
  "/sign-up",
  commonMiddleware.validateBody(UserValidator.signUp),
  authMiddleware.checkEmail(true),
  authController.signUp,
);

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     description: Authenticates a user and returns access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 pattern: '^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$'
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 pattern: '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$'
 *                 example: "Secure@123"
 *     responses:
 *       201:
 *         description: User successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SignInResponse"
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
 *                     - "\"email\" is required"
 *                     - "\"password\" is required"
 *                     - "\"email\" with value \"user_testgmail.com\" fails to match the required pattern: /^[^\\s@]+@([^\\s@.,]+\\.)+[^\\s@.,]{2,}$/"
 *                     - "\"password\" with value \"fffff11111\" fails to match the required pattern: /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%_*#?&])[A-Za-z\\d@$_!%*#?&]{8,}$/"
 *                   example: "\"email\" is required"
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
 *                     - "Invalid credentials"
 *                   example: "Invalid credentials"
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
 *                   example: "Something went wrong"
 */
router.post(
  "/sign-in",
  commonMiddleware.validateBody(UserValidator.signIn),
  authMiddleware.checkEmail(),
  authController.signIn,
);

/**
 * @swagger
 * /api/auth/account-restore:
 *   post:
 *     summary: Request account restoration
 *     tags: [Auth]
 *     description: Sends an account restoration link to the provided email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 pattern: '^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$'
 *                 example: "johndoe@example.com"
 *     responses:
 *       204:
 *         description: Account restoration email sent.
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
 *                     - "\"email\" is required"
 *                     - "\"email\" with value \"user_testgmail.com\" fails to match the required pattern: /^[^\\s@]+@([^\\s@.,]+\\.)+[^\\s@.,]{2,}$/"
 *                   example: "\"email\" is required"
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
 *                     - "Invalid credentials"
 *                   example: "Invalid credentials"
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
 *                     - "Invalid token type"
 *                     - "Unknown email type"
 *                     - "Failed to send email: [DETAILED_ERROR.MESSAGE]"
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.post(
  "/account-restore",
  commonMiddleware.validateBody(UserValidator.accountRestore),
  authController.accountRestore,
);

/**
 * @swagger
 * /api/auth/account-restore:
 *   put:
 *     summary: Restore account
 *     tags: [Auth]
 *     description: Allows a user to restore their account using an action token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: The action token for account restoration.
 *                 example: "eyJhbGciOiJIUzI1..."
 *               password:
 *                 type: string
 *                 format: password
 *                 pattern: '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$'
 *                 example: "NewSecure@123"
 *     responses:
 *       204:
 *         description: Account successfully restored.
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
 *                     - "Action token is required"
 *                   example: "Action token is required"
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
 *                     - "Invalid or expired token"
 *                   example: "Invalid or expired token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.put(
  "/account-restore",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.ACCOUNT_RESTORE),
  // at this point user can set the old one password
  authController.accountRestoreSet,
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     description: Logs out the user by invalidating the current access token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out.
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
 *                     - "Unknown email type"
 *                     - "Failed to send email: [DETAILED_ERROR.MESSAGE]"
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.post("/logout", authMiddleware.checkAccessToken, authController.logout);

/**
 * @swagger
 * /api/auth/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Auth]
 *     description: Logs out the user from all active sessions.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out from all devices.
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
 *                     - "Unknown email type"
 *                     - "Failed to send email: [DETAILED_ERROR.MESSAGE]"
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Issues a new access token using the provided refresh token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Successfully refreshed token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TokenPair"
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
 *                     - "Invalid token type"
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     description: Sends a password reset link to the provided email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 pattern: '^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$'
 *                 example: "johndoe@example.com"
 *     responses:
 *       204:
 *         description: Password reset email sent.
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
 *                     - "\"email\" is required"
 *                     - "\"email\" with value \"user_testgmail.com\" fails to match the required pattern: /^[^\\s@]+@([^\\s@.,]+\\.)+[^\\s@.,]{2,}$/"
 *                   example: "\"email\" is required"
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
 *                     - "Invalid credentials"
 *                   example: "Invalid credentials"
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
 *                     - "Invalid token type"
 *                     - "Unknown email type"
 *                     - "Failed to send email: [DETAILED_ERROR.MESSAGE]"
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.post(
  "/forgot-password",
  commonMiddleware.validateBody(UserValidator.forgotPassword),
  authController.forgotPassword,
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   put:
 *     summary: Reset password
 *     tags: [Auth]
 *     description: Allows the user to reset their password using an action token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: The action token for password reset.
 *                 example: "eyJhbGciOiJIUzI1..."
 *               password:
 *                 type: string
 *                 format: password
 *                 pattern: '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$'
 *                 example: "NewSecure@123"
 *     responses:
 *       204:
 *         description: Password successfully reset.
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
 *                     - "Action token is required"
 *                     - "You cannot set the old password"
 *                   example: "Action token is required"
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
 *                     - "Invalid or expired token"
 *                   example: "Invalid or expired token"
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
 *                     - "Invalid token type"
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.put(
  "/forgot-password",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
  authController.forgotPasswordSet,
);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Auth]
 *     description: Allows the user to change their password when authenticated.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword@123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%_*#?&])[A-Za-z\\d@$_!%*#?&]{8,}$'
 *                 example: "NewSecure@123"
 *     responses:
 *       204:
 *         description: Password successfully changed.
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
 *                     - "You cannot set the old password"
 *                     - "\"newPassword\" is required"
 *                     - "\"oldPassword\" is required"
 *                     - "\"oldPassword\" with value \"fffff11111\" fails to match the required pattern: /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%_*#?&])[A-Za-z\\d@$_!%*#?&]{8,}$/"
 *                     - "\"newPassword\" with value \"fffff11111\" fails to match the required pattern: /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%_*#?&])[A-Za-z\\d@$_!%*#?&]{8,}$/"
 *                   example: "You cannot set the old password"
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
 *                     - "Invalid credentials"
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
 *                   example: "Something went wrong"
 */
router.put(
  "/change-password",
  commonMiddleware.validateBody(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword,
);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify user email
 *     tags: [Auth]
 *     description: Confirms a user's email using an action token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: The action token for email verification.
 *                 example: "eyJhbGciOiJIUzI1..."
 *     responses:
 *       204:
 *         description: Email successfully verified.
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
 *                     - "Action token is required"
 *                   example: "Action token is required"
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
 *                     - "Invalid or expired token"
 *                   example: "Invalid or expired token"
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
 *                     - "Invalid token type"
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.post(
  "/verify-email",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY_EMAIL),
  authController.verify,
);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Auth]
 *     description: Resends the verification email to the user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Verification email resent.
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
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Email is already verified"
 *                   example: "Email is already verified"
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
 *                     - "Invalid token type"
 *                     - "Something went wrong"
 *                   example: "Something went wrong"
 */
router.post(
  "/resend-verification",
  authMiddleware.checkAccessToken,
  authController.resendVerifyEmail,
);

export const authRouter = router;
