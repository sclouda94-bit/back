import { Hono } from "hono";
import { ProductRepository } from "../repositories/ProductRepository";

export class ProductController {
    private repo = new ProductRepository();
    public router = new Hono();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", async (c) => {
            const products = await this.repo.findAll();
            return c.json(products);
        });

        this.router.get("/:id", async (c) => {
            const id = parseInt(c.req.param("id"));
            const product = await this.repo.findById(id);
            if (!product) return c.json({ error: "Product not found" }, 404);
            return c.json(product);
        });

        this.router.post("/", async (c) => {
            const body = await c.req.json();
            const product = await this.repo.create(body);
            return c.json(product, 201);
        });

        this.router.put("/:id", async (c) => {
            const id = parseInt(c.req.param("id"));
            const body = await c.req.json();
            const product = await this.repo.update(id, body);
            if (!product) return c.json({ error: "Product not found" }, 404);
            return c.json(product);
        });

        this.router.delete("/:id", async (c) => {
            const id = parseInt(c.req.param("id"));
            await this.repo.delete(id);
            return c.json({ success: true });
        });
    }
}
