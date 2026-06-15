import "reflect-metadata";
import { serve as honoServe } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { AppDataSource } from "./config/database";
import { ProductController } from "./controllers/ProductController";
import { ClientController } from "./controllers/ClientController";
import { SaleController } from "./controllers/SaleController";
import { InventoryController } from "./controllers/InventoryController";
import { ReportController } from "./controllers/ReportController";
import { SettingController } from "./controllers/SettingController";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

// Enable CORS for all routes
app.use("/*", cors());

// Initialize DB and register API routes FIRST (before static file serving)
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        const productController = new ProductController();
        const clientController = new ClientController();
        const saleController = new SaleController();
        const inventoryController = new InventoryController();
        const reportController = new ReportController();
        const settingController = new SettingController();

        app.route("/api/products", productController.router);
        app.route("/api/clients", clientController.router);
        app.route("/api/sales", saleController.router);
        app.route("/api/inventory", inventoryController.router);
        app.route("/api/reports", reportController.router);
        app.route("/api/settings", settingController.router);

        // Serve static assets (JS, CSS, images) from the compiled frontend
        app.use("/*", serveStatic({ root: "./public" }));

        // SPA fallback: all unmatched routes return index.html (React Router support)
        app.get("*", serveStatic({ path: "index.html", root: "./public" }));

        const port = parseInt(process.env.PORT || "3000");
        console.log(`Server is running on port ${port}`);

        honoServe({
            fetch: app.fetch,
            port
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    });
