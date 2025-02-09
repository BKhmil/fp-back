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
      },
    },
  },
  apis: [path.join(__dirname, "..", "routers", "*.ts")],
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
