import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../entities/Product";
import { Client } from "../entities/Client";
import { Sale } from "../entities/Sale";
import { SaleDetail } from "../entities/SaleDetail";
import { InventoryMovement } from "../entities/InventoryMovement";
import { Setting } from "../entities/Setting";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "Kmarket",
    synchronize: true, // Auto create tables, good for dev
    logging: false,
    entities: [Product, Client, Sale, SaleDetail, InventoryMovement, Setting],
    subscribers: [],
    migrations: [],
});
