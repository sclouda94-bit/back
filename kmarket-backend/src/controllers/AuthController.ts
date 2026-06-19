import { Hono } from "hono";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-use-a-strong-secret";
const SALT_ROUNDS = 10;

/** Shape returned to the client for a user object (no password hash). */
function safeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    createdAt: user.createdAt,
  };
}

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

const authRouter = new Hono();

// POST /api/auth/register
authRouter.post("/register", async (c) => {
  const body = await c.req.json<{
    name?: string;
    email?: string;
    password?: string;
    businessName?: string;
  }>();

  const { name, email, password, businessName } = body;

  if (!name || !email || !password) {
    return c.json({ error: "name, email y password son requeridos" }, 400);
  }

  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    return c.json({ error: "Ya existe una cuenta con ese correo" }, 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = userRepo.create({
    name,
    email,
    passwordHash,
    businessName: businessName ?? null,
  });

  await userRepo.save(user);

  const token = signToken(user.id);

  return c.json({ token, user: safeUser(user) }, 201);
});

// POST /api/auth/login
authRouter.post("/login", async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();

  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: "email y password son requeridos" }, 400);
  }

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { email } });

  if (!user) {
    return c.json({ error: "Credenciales inválidas" }, 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return c.json({ error: "Credenciales inválidas" }, 401);
  }

  const token = signToken(user.id);

  return c.json({ token, user: safeUser(user) });
});

// GET /api/auth/me
authRouter.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Token requerido" }, 401);
  }

  const token = authHeader.slice(7);

  let payload: { sub: string };
  try {
    payload = jwt.verify(token, JWT_SECRET) as { sub: string };
  } catch {
    return c.json({ error: "Token inválido o expirado" }, 401);
  }

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: payload.sub } });

  if (!user) {
    return c.json({ error: "Usuario no encontrado" }, 404);
  }

  return c.json(safeUser(user));
});

export class AuthController {
  readonly router = authRouter;
}
