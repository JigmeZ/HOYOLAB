import express from "express";
import {
  getPosts,
  createPost,
  addToTabs,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.patch("/:id/add-to-tabs", addToTabs);

export default router;
