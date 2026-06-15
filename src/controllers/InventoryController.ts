import { Hono } from "hono";
import { AppDataSource } from "../config/database";
import { InventoryMovement } from "../entities/InventoryMovement";
import { Product } from "../entities/Product";

export class InventoryController {
    public router = new Hono();
    private inventoryRepo = AppDataSource.getRepository(InventoryMovement);
    private productRepo = AppDataSource.getRepository(Product);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Get all movements
        this.router.get("/movements", async (c) => {
            try {
                const movements = await this.inventoryRepo.find({ order: { createdAt: "DESC" } });
                const products = await this.productRepo.find();
                
                const mapped = movements.map(mov => {
                    const prod = products.find(p => p.id === mov.productId);
                    return {
                        ...mov,
                        productName: prod ? prod.name : "Producto Eliminado"
                    };
                });
                
                return c.json(mapped);
            } catch (error) {
                console.error("Error fetching inventory movements:", error);
                return c.json({ error: "Failed to fetch inventory movements" }, 500);
            }
        });

        // Create a movement and adjust stock
        this.router.post("/movements", async (c) => {
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const body = await c.req.json();
                const { productId, type, quantity, reason } = body;

                if (!productId || !type || !quantity) {
                    return c.json({ error: "Missing required fields" }, 400);
                }

                if (quantity <= 0) {
                    return c.json({ error: "Quantity must be positive" }, 400);
                }

                // Create movement record
                const movement = new InventoryMovement();
                movement.productId = productId;
                movement.type = type;
                movement.quantity = quantity;
                movement.reason = reason || '';

                await queryRunner.manager.save(InventoryMovement, movement);

                // Adjust product stock
                const product = await queryRunner.manager.findOneBy(Product, { id: productId });
                if (!product) {
                    throw new Error("Product not found");
                }

                if (type === "IN") {
                    product.stock += quantity;
                } else if (type === "OUT") {
                    if (product.stock < quantity) {
                        throw new Error("Insufficient stock for OUT movement");
                    }
                    product.stock -= quantity;
                }

                await queryRunner.manager.save(Product, product);

                await queryRunner.commitTransaction();
                return c.json(movement, 201);
            } catch (error: any) {
                await queryRunner.rollbackTransaction();
                console.error("Error creating inventory movement:", error);
                return c.json({ error: error.message || "Failed to create inventory movement" }, 500);
            } finally {
                await queryRunner.release();
            }
        });
    }
}
