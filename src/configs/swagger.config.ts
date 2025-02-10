import path from "node:path";

import swaggerJsdoc from "swagger-jsdoc";

import { envConfig } from "./env.config";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User_posts API",
      version: "1.0.0",
      description: "API documentation",
      contact: {
        email: "khmil.work@gmail.com",
      },
    },
    servers: [
      { url: "http://" + envConfig.APP_HOST + ":" + envConfig.APP_PORT },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        UserShortResponse: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64a4f3d16c4b8c0012a56cde",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-02-01T12:00:00.000Z",
            },
          },
        },
        UserListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/UserShortResponse",
              },
            },
            total: {
              type: "integer",
              example: 100,
            },
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            name: {
              type: "string",
              nullable: true,
              example: "John",
            },
            age: {
              type: "integer",
              nullable: true,
              example: 25,
            },
            order: {
              type: "string",
              enum: ["asc", "desc"],
              example: "asc",
            },
            orderBy: {
              type: "string",
              enum: ["name", "age", "createdAt"],
              example: "createdAt",
            },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a4f3d16c4b8c0012a56cde" },
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              pattern: "^[^\\s@]+@([^\\s@.,]+\\.)+[^\\s@.,]{2,}$",
              example: "john.doe@example.com",
            },
            age: { type: "integer", example: 30 },
            isVerified: { type: "boolean", example: true },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-02-01T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-02-05T15:30:00.000Z",
            },
          },
        },
        TokenPair: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            },
            refreshToken: {
              type: "string",
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            },
          },
        },
        SignInResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/UserResponse",
            },
            tokens: {
              $ref: "#/components/schemas/TokenPair",
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "67a93caec0275180ed96c961",
            },
            title: {
              type: "string",
              example: "New title",
            },
            text: {
              type: "string",
              example: "lorem ipsum dolore sit amet",
            },
            _userId: {
              type: "string",
              example: "67a91cb50aabde43f353ac59",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-02-01T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-02-05T15:30:00.000Z",
            },
          },
        },
        PostResponse: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "67a93caec0275180ed96c961",
            },
            title: {
              type: "string",
              example: "New title",
            },
            text: {
              type: "string",
              example: "lorem ipsum dolore sit amet",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-02-01T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-02-05T15:30:00.000Z",
            },
          },
        },
        PostListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/PostResponse",
              },
            },
            total: {
              type: "integer",
              example: 100,
            },
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            title: {
              type: "string",
              nullable: true,
              example: "New Title",
            },
            order: {
              type: "string",
              enum: ["asc", "desc"],
              example: "asc",
            },
            orderBy: {
              type: "string",
              enum: ["title", "createdAt"],
              example: "createdAt",
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "..", "routers", "*.ts")],
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
