import express from "express";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

app.use("/api/auth", authRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", status: "ok" });
});

app.get("/", (req, res) => res.send("API running!"));

export default app;

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
