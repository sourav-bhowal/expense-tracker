import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRouter } from "./expenses.routes";

export const app = new Hono();

// Middleware to log requests
app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/expenses", expensesRouter);

export type ApiRoutes = typeof apiRoutes;
