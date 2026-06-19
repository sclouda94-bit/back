import "reflect-metadata";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { AppDataSource } from "./data-source";
import { AuthController } from "./controllers/AuthController";

const app = new Hono();

// CORS — allow the frontend origin in development
app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Auth routes
const authController = new AuthController();
app.route("/api/auth", authController.router);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

const PORT = Number(process.env.PORT) || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    serve({ fetch: app.fetch, port: PORT }, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
