import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRouter } from "./expenses.routes";
import { authRouter } from "./auth.routes";

export const app = new Hono();

// Middleware to log requests
app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/expenses", expensesRouter)
  .route("/", authRouter);

export type ApiRoutes = typeof apiRoutes;
