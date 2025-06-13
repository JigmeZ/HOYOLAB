import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
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

// Add post after upload (store in DB, not in-memory)
app.post("/api/posts", async (req, res) => {
  try {
    const { username, avatar, type, url, text } = req.body;
    // Find user by username
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create video (post)
    const video = await prisma.video.create({
      data: {
        userId: user.id,
        caption: text || "New upload!",
        videoUrl: url,
        thumbnailUrl: avatar,
        audioName: type,
        // Add other fields as needed
      },
    });

    res.status(201).json({
      id: video.id,
      username: user.username,
      avatar: avatar,
      time: video.createdAt,
      category:
        type === "image" ? "Image" : type === "video" ? "Video" : "Post",
      text: video.caption,
      images: type === "image" ? [url] : undefined,
      video: type === "video" ? url : undefined,
      views: video.views,
      comments: 0,
      likes: 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts (from DB)
app.get("/api/posts", async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: { user: true, comments: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    // Map to frontend format if needed
    res.json(
      videos.map((video) => ({
        id: video.id,
        username: video.user.username,
        avatar: video.thumbnailUrl,
        time: video.createdAt,
        category: video.audioName,
        text: video.caption,
        images: video.audioName === "image" ? [video.videoUrl] : undefined,
        video: video.audioName === "video" ? video.videoUrl : undefined,
        views: video.views,
        comments: video.comments.length,
        likes: video.likes.length,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like a post (store in DB)
app.post("/api/posts/:id/like", async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    // Check if like already exists
    const existing = await prisma.videoLike.findUnique({
      where: { userId_videoId: { userId: Number(userId), videoId: postId } },
    });
    if (existing) {
      return res.status(200).json({ success: true, alreadyLiked: true });
    }

    // Create like
    await prisma.videoLike.create({
      data: {
        userId: Number(userId),
        videoId: postId,
      },
    });

    // Count total likes
    const likes = await prisma.videoLike.count({ where: { videoId: postId } });
    res.json({ success: true, likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Comment on a post (store in DB, using the comments table)
app.post("/api/posts/:id/comment", async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { user, text } = req.body;
    if (!user || !text)
      return res.status(400).json({ message: "Missing user or text" });

    // Find user by username
    const dbUser = await prisma.user.findFirst({ where: { username: user } });
    if (!dbUser) return res.status(404).json({ message: "User not found" });

    // Store comment in the comments table (prisma model: Comment)
    const comment = await prisma.comment.create({
      data: {
        userId: dbUser.id,
        videoId: postId,
        content: text,
      },
    });

    // Optionally, return all comments for this post
    const allComments = await prisma.comment.findMany({
      where: { videoId: postId },
      include: { user: { select: { username: true } } },
    });

    res.json({
      success: true,
      comments: allComments.length,
      allComments: allComments.map((c) => ({
        user: c.user.username,
        text: c.content,
        id: c.id,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default app;

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
