export const ERRORS = {
  USER_NOT_FOUND: { message: "User not found", statusCode: 404 },
  NO_AUTHORIZATION_HEADER: {
    message: "Authorization required",
    statusCode: 401,
  },
  INVALID_AUTH_FORMAT: {
    message: "Invalid Authorization format",
    statusCode: 401,
  },
  INVALID_TOKEN: { message: "Invalid or expired token", statusCode: 401 },
  ACTION_TOKEN_REQUIRED: {
    message: "Action token is required",
    statusCode: 400,
  },
  EMAIL_ALREADY_IN_USE: { message: "Email is already in use", statusCode: 409 },
  INVALID_CREDENTIALS: { message: "Invalid credentials", statusCode: 401 },
  INVALID_ID: { message: "Invalid ID format", statusCode: 400 },
  EMPTY_BODY: { message: "Request body cannot be empty", statusCode: 400 },
  VALIDATION_ERROR: { message: "Validation failed", statusCode: 400 },
} as const;
