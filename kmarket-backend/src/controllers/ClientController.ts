import { Hono } from "hono";
import { ClientRepository } from "../repositories/ClientRepository";

export class ClientController {
    private repo = new ClientRepository();
    public router = new Hono();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", async (c) => {
            const clients = await this.repo.findAll();
            return c.json(clients);
        });

        this.router.get("/:id", async (c) => {
            const id = parseInt(c.req.param("id"));
            const client = await this.repo.findById(id);
            if (!client) return c.json({ error: "Client not found" }, 404);
            return c.json(client);
        });

        this.router.post("/", async (c) => {
            const body = await c.req.json();
            const client = await this.repo.create(body);
            return c.json(client, 201);
        });

        this.router.put("/:id", async (c) => {
            const id = parseInt(c.req.param("id"));
            const body = await c.req.json();
            const client = await this.repo.update(id, body);
            if (!client) return c.json({ error: "Client not found" }, 404);
            return c.json(client);
        });

        this.router.delete("/:id", async (c) => {
            const id = parseInt(c.req.param("id"));
            await this.repo.delete(id);
            return c.json({ success: true });
        });
    }
}
