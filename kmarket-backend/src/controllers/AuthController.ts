import { Hono } from "hono";
import { AppEnv } from "../types";
import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository";
import { BusinessRepository } from "../repositories/BusinessRepository";
import { UserBusinessRepository } from "../repositories/UserBusinessRepository";
import { generateToken, authMiddleware } from "../middleware/auth";

export class AuthController {
    private userRepo = new UserRepository();
    private businessRepo = new BusinessRepository();
    private userBusinessRepo = new UserBusinessRepository();
    public router: Hono<AppEnv> = new Hono<AppEnv>();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/register", async (c) => {
            try {
                const { name, email, password, businessName } = await c.req.json();

                if (!name || !email || !password || !businessName) {
                    return c.json({ error: "Todos los campos son requeridos" }, 400);
                }

                const existing = await this.userRepo.findByEmail(email);
                if (existing) {
                    return c.json({ error: "El correo ya está registrado" }, 409);
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const business = await this.businessRepo.create({ name: businessName });
                const user = await this.userRepo.create({
                    name,
                    email,
                    password: hashedPassword,
                    avatar: name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2),
                });

                await this.userBusinessRepo.create({
                    userId: user.id,
                    businessId: business.id,
                    role: "owner",
                });

                const token = generateToken({ userId: user.id, businessId: business.id });

                return c.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        businesses: [
                            { id: business.id, name: business.name, role: "owner" },
                        ],
                    },
                }, 201);
            } catch (error) {
                console.error("Error registering user:", error);
                return c.json({ error: "Error al registrar" }, 500);
            }
        });

        this.router.post("/login", async (c) => {
            try {
                const { email, password, businessId } = await c.req.json();

                if (!email || !password) {
                    return c.json({ error: "Correo y contraseña requeridos" }, 400);
                }

                const user = await this.userRepo.findByEmail(email);
                if (!user) {
                    return c.json({ error: "Credenciales inválidas" }, 401);
                }

                const valid = await bcrypt.compare(password, user.password);
                if (!valid) {
                    return c.json({ error: "Credenciales inválidas" }, 401);
                }

                const userBusinesses = await this.userBusinessRepo.findByUser(user.id);
                if (userBusinesses.length === 0) {
                    return c.json({ error: "No tienes negocios asociados" }, 401);
                }

                let activeBusinessId: number;
                if (businessId) {
                    const hasAccess = userBusinesses.some((ub) => ub.businessId === businessId);
                    if (!hasAccess) {
                        return c.json({ error: "No tienes acceso a ese negocio" }, 403);
                    }
                    activeBusinessId = businessId;
                } else {
                    activeBusinessId = userBusinesses[0].businessId;
                }

                const business = await this.businessRepo.findById(activeBusinessId);
                const token = generateToken({ userId: user.id, businessId: activeBusinessId });

                const businesses = await Promise.all(
                    userBusinesses.map(async (ub) => {
                        const b = await this.businessRepo.findById(ub.businessId);
                        return { id: ub.businessId, name: b?.name || "", role: ub.role };
                    })
                );

                return c.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        businesses,
                    },
                });
            } catch (error) {
                console.error("Error logging in:", error);
                return c.json({ error: "Error al iniciar sesión" }, 500);
            }
        });

        this.router.get("/me", authMiddleware, async (c) => {
            try {
                const userId = c.get("userId");
                const user = await this.userRepo.findById(userId);
                if (!user) {
                    return c.json({ error: "Usuario no encontrado" }, 404);
                }

                const userBusinesses = await this.userBusinessRepo.findByUser(user.id);
                const businesses = await Promise.all(
                    userBusinesses.map(async (ub) => {
                        const b = await this.businessRepo.findById(ub.businessId);
                        return { id: ub.businessId, name: b?.name || "", role: ub.role };
                    })
                );

                return c.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    businesses,
                });
            } catch (error) {
                console.error("Error fetching user:", error);
                return c.json({ error: "Error al obtener usuario" }, 500);
            }
        });
    }
}
