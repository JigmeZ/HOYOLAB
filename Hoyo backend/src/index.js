import express from "express";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import multer from "multer";
import path from "path";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

app.use("/api/auth", authRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", status: "ok" });
});

app.get("/", (req, res) => res.send("API running!"));

// In-memory posts array for demo (replace with DB in production)
const posts = [];

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|webm/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File type not supported!");
  },
});

// Upload endpoints
app.post("/api/upload/image", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.error("No file uploaded or invalid file type");
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});
app.post("/api/upload/video", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.error("No file uploaded or invalid file type");
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});
app.post("/api/upload/post", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.error("No file uploaded or invalid file type");
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Add post after upload
app.post("/api/posts", (req, res) => {
  const { username, avatar, type, url, text } = req.body;
  const post = {
    id: Date.now(),
    username,
    avatar,
    time: new Date().toLocaleString(),
    category: type === "image" ? "Image" : type === "video" ? "Video" : "Post",
    text: text || "New upload!",
    images: type === "image" ? [url] : undefined,
    video: type === "video" ? url : undefined,
    views: "0",
    comments: 0,
    likes: 0,
  };
  posts.unshift(post);
  res.status(201).json(post);
});

// Get all posts (for recommended tab)
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// Like a post (in-memory demo)
app.post("/api/posts/:id/like", (req, res) => {
  const postId = Number(req.params.id);
  // Try both number and string id match for robustness
  const post = posts.find((p) => p.id === postId || p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  post.likes = (post.likes || 0) + 1;
  res.json({ success: true, likes: post.likes });
});

// Comment on a post (in-memory demo)
app.post("/api/posts/:id/comment", (req, res) => {
  const postId = Number(req.params.id);
  // Try both number and string id match for robustness
  const post = posts.find((p) => p.id === postId || p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  post.comments = (post.comments || 0) + 1;
  res.json({ success: true, comments: post.comments });
});

export default app;

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
