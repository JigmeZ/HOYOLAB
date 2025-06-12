console.log("authController.js loaded"); // Add this at the top

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const registerUser = async (req, res) => {
  const { username, email, password, name, confirmPassword } = req.body;
  // Check for required fields
  if (!username || !email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Optional: check password confirmation if sent
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, name },
    });

    // Log registration to backend terminal
    console.log(`New user registered: ${user.username} (${user.email})`);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  console.log("loginUser function called"); // Add this at the top of the function
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });

  try {
    // Allow login with either email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: email }],
      },
    });
    console.log("User lookup result:", user);

    if (!user) {
      console.log("Login failed: user not found for email/username", email);
      // List all users for debugging
      const allUsers = await prisma.user.findMany();
      console.log(
        "All users in DB:",
        allUsers.map((u) => ({ email: u.email, username: u.username }))
      );
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Login failed: password mismatch for email/username", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
};
