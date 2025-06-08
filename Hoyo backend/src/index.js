const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "your_super_secret_key"; // Store in .env ideally

// 🧪 Test route
app.get("/", (req, res) => {
  res.send("API running!");
});

// ✅ Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.json({ message: "User registered", user });
  } catch (error) {
    res.status(400).json({ error: "User already exists or invalid data." });
  }
});

// 🔑 Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

  res.json({ message: "Login successful", token });
});

// Simple GET endpoint to test backend connectivity
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", status: "ok" });
});

// Simple POST endpoint to echo back data
app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
