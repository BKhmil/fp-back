import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import { envConfig } from "./configs/env.config";
import { swaggerDocs } from "./configs/swagger.config";
import { ERRORS } from "./constants/errors.constant";
import { cronRunner } from "./crons";
import { ApiError } from "./errors/api.error";
import { apiRouter } from "./routers/api.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api", apiRouter);

app.use(
  "*",
  (error: ApiError, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || ERRORS.DEFAULT.statusCode;
    const message = error.message ?? ERRORS.DEFAULT.message;

    res.status(status).json({ message });
  },
);

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception: ", error);
  process.exit(1);
});

app.listen(envConfig.APP_PORT, async () => {
  await mongoose.connect(envConfig.MONGO_URI);
  await cronRunner();
  console.log(
    "Server is running on http://" +
      envConfig.APP_HOST +
      ":" +
      envConfig.APP_PORT,
  );
  console.log(
    "Swagger is available on http://" +
      envConfig.APP_HOST +
      ":" +
      envConfig.APP_PORT +
      "/docs",
  );
});
