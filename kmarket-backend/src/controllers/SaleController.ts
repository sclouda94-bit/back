import { Hono } from "hono";
import { AppEnv } from "../types";
import { AppDataSource } from "../config/database";
import { Sale } from "../entities/Sale";
import { SaleDetail } from "../entities/SaleDetail";
import { Product } from "../entities/Product";
import { Client } from "../entities/Client";
import { authMiddleware } from "../middleware/auth";

export class SaleController {
    public router: Hono<AppEnv> = new Hono<AppEnv>();
    private saleRepo = AppDataSource.getRepository(Sale);
    private saleDetailRepo = AppDataSource.getRepository(SaleDetail);
    private productRepo = AppDataSource.getRepository(Product);
    private clientRepo = AppDataSource.getRepository(Client);

    constructor() {
        this.router.use("*", authMiddleware);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", async (c) => {
            try {
                const businessId = c.get("businessId");
                const sales = await this.saleRepo.find({ where: { businessId }, order: { saleDate: "DESC", createdAt: "DESC" } });
                const clients = await this.clientRepo.find({ where: { businessId } });

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

        this.router.get("/:id", async (c) => {
            try {
                const id = parseInt(c.req.param("id"));
                const businessId = c.get("businessId");
                const sale = await this.saleRepo.findOneBy({ id, businessId });
                if (!sale) return c.json({ error: "Sale not found" }, 404);

                const details = await this.saleDetailRepo.findBy({ saleId: id, businessId });

                return c.json({ sale, details });
            } catch (error) {
                return c.json({ error: "Failed to fetch sale details" }, 500);
            }
        });

        this.router.post("/", async (c) => {
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const businessId = c.get("businessId");
                const body = await c.req.json();
                const { clientId, totalAmount, paymentMethod, items, saleDate } = body;

                const newSale = new Sale();
                newSale.businessId = businessId;
                newSale.clientId = clientId || null;
                newSale.totalAmount = totalAmount;
                newSale.paymentMethod = paymentMethod || 'cash';
                newSale.status = 'completed';
                if (saleDate) {
                    const [y, m, d] = saleDate.split('-').map(Number);
                    newSale.saleDate = new Date(y, m - 1, d);
                }

                const savedSale = await queryRunner.manager.save(Sale, newSale);

                for (const item of items) {
                    const product = await queryRunner.manager.findOneBy(Product, { id: item.productId, businessId });

                    const detail = new SaleDetail();
                    detail.saleId = savedSale.id;
                    detail.businessId = businessId;
                    detail.productId = item.productId;
                    detail.quantity = item.quantity;
                    detail.unitPrice = item.unitPrice;
                    detail.subtotal = item.subtotal;
                    detail.unitCost = product ? Number(product.cost || 0) : 0;

                    await queryRunner.manager.save(SaleDetail, detail);

                    if (product) {
                        if (product.stock < item.quantity) {
                            throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`);
                        }
                        product.stock -= item.quantity;
                        await queryRunner.manager.save(Product, product);
                    }
                }

                if (clientId) {
                    const client = await queryRunner.manager.findOneBy(Client, { id: clientId, businessId });
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

        // ── Update sale ─────────────────────────────────────────
        this.router.put("/:id", async (c) => {
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const businessId = c.get("businessId");
                const id = parseInt(c.req.param("id"));
                const body = await c.req.json();
                const { clientId, totalAmount, paymentMethod, items, saleDate } = body;

                const existingSale = await queryRunner.manager.findOneBy(Sale, { id, businessId });
                if (!existingSale) return c.json({ error: "Sale not found" }, 404);

                const oldDetails = await queryRunner.manager.findBy(SaleDetail, { saleId: id, businessId });
                const oldClientId = existingSale.clientId;

                // ── Adjust stock for item changes ────────────────
                for (const old of oldDetails) {
                    const newItem = items.find((i: any) => i.productId === old.productId);
                    const qtyDiff = newItem ? newItem.quantity - old.quantity : -old.quantity;
                    if (qtyDiff !== 0) {
                        const product = await queryRunner.manager.findOneBy(Product, { id: old.productId, businessId });
                        if (product) {
                            if (qtyDiff > 0 && product.stock < qtyDiff) {
                                throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${qtyDiff}`);
                            }
                            product.stock -= qtyDiff;
                            await queryRunner.manager.save(Product, product);
                        }
                    }
                }

                // Handle entirely new items (not in old details)
                for (const newItem of items) {
                    const exists = oldDetails.find(d => d.productId === newItem.productId);
                    if (!exists) {
                        const product = await queryRunner.manager.findOneBy(Product, { id: newItem.productId, businessId });
                        if (product) {
                            if (product.stock < newItem.quantity) {
                                throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${newItem.quantity}`);
                            }
                            product.stock -= newItem.quantity;
                            await queryRunner.manager.save(Product, product);
                        }
                    }
                }

                // ── Handle client change ─────────────────────────
                if (oldClientId !== (clientId || null)) {
                    if (oldClientId) {
                        const oldClient = await queryRunner.manager.findOneBy(Client, { id: oldClientId, businessId });
                        if (oldClient) {
                            oldClient.totalPurchases = Math.max(0, oldClient.totalPurchases - 1);
                            oldClient.totalSpent = Math.max(0, Number(oldClient.totalSpent) - Number(existingSale.totalAmount));
                            await queryRunner.manager.save(Client, oldClient);
                        }
                    }
                    if (clientId) {
                        const newClient = await queryRunner.manager.findOneBy(Client, { id: clientId, businessId });
                        if (newClient) {
                            newClient.totalPurchases += 1;
                            newClient.totalSpent = Number(newClient.totalSpent) + Number(totalAmount);
                            newClient.lastVisit = new Date().toISOString();
                            await queryRunner.manager.save(Client, newClient);
                        }
                    }
                } else if (clientId) {
                    // Same client, just update totalSpent with the difference
                    const client = await queryRunner.manager.findOneBy(Client, { id: clientId, businessId });
                    if (client) {
                        const diff = Number(totalAmount) - Number(existingSale.totalAmount);
                        client.totalSpent = Math.max(0, Number(client.totalSpent) + diff);
                        client.lastVisit = new Date().toISOString();
                        await queryRunner.manager.save(Client, client);
                    }
                }

                // ── Update sale fields ───────────────────────────
                existingSale.clientId = clientId || null;
                existingSale.totalAmount = totalAmount;
                existingSale.paymentMethod = paymentMethod || 'cash';
                if (saleDate) {
                    const [y, m, d] = saleDate.split('-').map(Number);
                    existingSale.saleDate = new Date(y, m - 1, d);
                } else {
                    existingSale.saleDate = null;
                }
                await queryRunner.manager.save(Sale, existingSale);

                // ── Replace details ──────────────────────────────
                await queryRunner.manager.delete(SaleDetail, { saleId: id, businessId });
                for (const item of items) {
                    const product = await queryRunner.manager.findOneBy(Product, { id: item.productId, businessId });
                    const detail = new SaleDetail();
                    detail.saleId = id;
                    detail.businessId = businessId;
                    detail.productId = item.productId;
                    detail.quantity = item.quantity;
                    detail.unitPrice = item.unitPrice;
                    detail.subtotal = item.subtotal;
                    detail.unitCost = product ? Number(product.cost || 0) : 0;
                    await queryRunner.manager.save(SaleDetail, detail);
                }

                await queryRunner.commitTransaction();
                return c.json(existingSale);
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.error("Error updating sale:", error);
                return c.json({ error: "Failed to update sale" }, 500);
            } finally {
                await queryRunner.release();
            }
        });

        // ── Delete sale ─────────────────────────────────────────
        this.router.delete("/:id", async (c) => {
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const businessId = c.get("businessId");
                const id = parseInt(c.req.param("id"));

                const sale = await queryRunner.manager.findOneBy(Sale, { id, businessId });
                if (!sale) return c.json({ error: "Sale not found" }, 404);

                const details = await queryRunner.manager.findBy(SaleDetail, { saleId: id, businessId });

                // ── Restore product stock ─────────────────────────
                for (const detail of details) {
                    const product = await queryRunner.manager.findOneBy(Product, { id: detail.productId, businessId });
                    if (product) {
                        product.stock += detail.quantity;
                        await queryRunner.manager.save(Product, product);
                    }
                }

                // ── Update client stats ─────────────────────────
                if (sale.clientId) {
                    const client = await queryRunner.manager.findOneBy(Client, { id: sale.clientId, businessId });
                    if (client) {
                        client.totalPurchases = Math.max(0, client.totalPurchases - 1);
                        client.totalSpent = Math.max(0, Number(client.totalSpent) - Number(sale.totalAmount));
                        await queryRunner.manager.save(Client, client);
                    }
                }

                // ── Delete details & sale ────────────────────────
                await queryRunner.manager.delete(SaleDetail, { saleId: id, businessId });
                await queryRunner.manager.delete(Sale, { id, businessId });

                await queryRunner.commitTransaction();
                return c.json({ success: true });
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.error("Error deleting sale:", error);
                return c.json({ error: "Failed to delete sale" }, 500);
            } finally {
                await queryRunner.release();
            }
        });
    }
}

