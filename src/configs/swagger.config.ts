import path from "node:path";

import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User_posts API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "..", "routers", "*.ts")],
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
