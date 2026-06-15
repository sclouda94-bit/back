import { Hono } from "hono";
import { AppDataSource } from "../config/database";
import { Sale } from "../entities/Sale";
import { SaleDetail } from "../entities/SaleDetail";
import { Product } from "../entities/Product";
import { Client } from "../entities/Client";

export class SaleController {
    public router = new Hono();
    private saleRepo = AppDataSource.getRepository(Sale);
    private saleDetailRepo = AppDataSource.getRepository(SaleDetail);
    private productRepo = AppDataSource.getRepository(Product);
    private clientRepo = AppDataSource.getRepository(Client);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Get all sales
        this.router.get("/", async (c) => {
            try {
                // Fetch sales. Note: Since we don't have explicit TypeORM relations setup
                // to keep it simple, we can fetch all sales, and maybe fetch clients to map names
                const sales = await this.saleRepo.find({ order: { createdAt: "DESC" } });
                const clients = await this.clientRepo.find();
                
                const salesWithClient = sales.map(sale => {
                    const client = clients.find(cl => cl.id === sale.clientId);
                    return {
                        ...sale,
                        clientName: client ? client.name : "Consumidor Final"
                    };
                });
                
                return c.json(salesWithClient);
            } catch (error) {
                console.error("Error fetching sales:", error);
                return c.json({ error: "Failed to fetch sales" }, 500);
            }
        });

        // Get sale by ID including details
        this.router.get("/:id", async (c) => {
            try {
                const id = parseInt(c.req.param("id"));
                const sale = await this.saleRepo.findOneBy({ id });
                if (!sale) return c.json({ error: "Sale not found" }, 404);

                const details = await this.saleDetailRepo.findBy({ saleId: id });
                
                return c.json({ sale, details });
            } catch (error) {
                return c.json({ error: "Failed to fetch sale details" }, 500);
            }
        });

        // Create a new sale
        this.router.post("/", async (c) => {
            // Using a transaction to ensure either everything succeeds or fails
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const body = await c.req.json();
                const { clientId, totalAmount, paymentMethod, items } = body;
                // items is expected to be an array of { productId, quantity, unitPrice, subtotal }

                // 1. Create the Sale record
                const newSale = new Sale();
                newSale.clientId = clientId || null;
                newSale.totalAmount = totalAmount;
                newSale.paymentMethod = paymentMethod || 'cash';
                newSale.status = 'completed';

                const savedSale = await queryRunner.manager.save(Sale, newSale);

                // 2. Create SaleDetail records and update Product stock
                for (const item of items) {
                    const detail = new SaleDetail();
                    detail.saleId = savedSale.id;
                    detail.productId = item.productId;
                    detail.quantity = item.quantity;
                    detail.unitPrice = item.unitPrice;
                    detail.subtotal = item.subtotal;

                    await queryRunner.manager.save(SaleDetail, detail);

                    // Update Product stock (validate sufficient stock first)
                    const product = await queryRunner.manager.findOneBy(Product, { id: item.productId });
                    if (product) {
                        if (product.stock < item.quantity) {
                            throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`);
                        }
                        product.stock -= item.quantity;
                        await queryRunner.manager.save(Product, product);
                    }
                }

                // If clientId provided, optionally update totalPurchases and totalSpent
                if (clientId) {
                    const client = await queryRunner.manager.findOneBy(Client, { id: clientId });
                    if (client) {
                        client.totalPurchases += 1;
                        client.totalSpent = Number(client.totalSpent) + Number(totalAmount);
                        client.lastVisit = new Date().toISOString();
                        await queryRunner.manager.save(Client, client);
                    }
                }

                await queryRunner.commitTransaction();
                return c.json(savedSale, 201);
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.error("Error creating sale:", error);
                return c.json({ error: "Failed to create sale" }, 500);
            } finally {
                await queryRunner.release();
            }
        });
    }
}
