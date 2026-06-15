import "reflect-metadata";
import { serve } from "@hono/node-server";
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

// Enable CORS for frontend
app.use("/*", cors());

app.get("/", (c) => {
    return c.text("Welcome to KMarket API");
});

// Initialize DB and routes
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

        const port = parseInt(process.env.PORT || "3000");
        console.log(`Server is running on port ${port}`);

        serve({
            fetch: app.fetch,
            port
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
