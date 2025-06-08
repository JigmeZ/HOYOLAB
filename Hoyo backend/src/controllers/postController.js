import Post from '../models/postModel.js';

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.status(201).json(newPost);
};
