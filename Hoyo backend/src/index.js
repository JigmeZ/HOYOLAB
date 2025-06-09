import express from "express";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 1440,
      },
      JWT_SECRET
    );

    return res.json({ message: "User registered", token });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(400).json({ error: "User already exists" });
    }
    return res.status(400).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, email: true },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 1440,
      },
      JWT_SECRET
    );

    return res.json({ message: "Login successful", token });
  } catch (error) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
});

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", status: "ok" });
});

app.get("/", (req, res) => res.send("API running!"));

export default app;

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
