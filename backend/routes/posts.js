import express from 'express';

const router = express.Router();

// Mock data
const posts = [
  {
    id: 1,
    user: 'Herabst🪬',
    content: 'HOLY Damn',
    likes: 1448,
    comments: 119,
    views: 67000,
  },
  {
    id: 2,
    user: 'Fritzqt✨',
    content: 'Exploring the beauty of Teyvat!',
    likes: 1200,
    comments: 89,
    views: 45000,
  },
];

// Get all posts
router.get('/', (req, res) => {
  res.json(posts);
});

export default router;
