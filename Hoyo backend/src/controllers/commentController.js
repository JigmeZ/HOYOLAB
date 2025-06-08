import Comment from '../models/commentModel.js';

export const addComment = async (req, res) => {
  const { text, postId } = req.body;
  const comment = await Comment.create({ text, post: postId, user: req.user.id });
  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId }).populate('user', 'username');
  res.json(comments);
};
