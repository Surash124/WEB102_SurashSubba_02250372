const prisma = require('../lib/prisma');

const getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: { user: { select: { username: true } } },
    });
    res.status(200).json(comments.map((c) => ({ ...c, username: c.user.username })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getCommentById = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: { select: { username: true } } },
    });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.status(200).json({ ...comment, username: comment.user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createComment = async (req, res) => {
  try {
    const { videoId, userId, text } = req.body;
    if (!videoId || !userId || !text) {
      return res.status(400).json({ error: 'videoId, userId and text are required' });
    }
    const comment = await prisma.comment.create({
      data: {
        text,
        userId: parseInt(userId),
        videoId: parseInt(videoId),
      },
      include: { user: { select: { username: true } } },
    });
    res.status(201).json({ ...comment, username: comment.user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { text: req.body.text },
    });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    await prisma.comment.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const likeComment = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    await prisma.commentLike.create({
      data: {
        userId: parseInt(userId),
        commentId: parseInt(req.params.id),
      },
    });
    res.status(201).json({ message: 'Comment liked successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Already liked this comment' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const unlikeComment = async (req, res) => {
  try {
    const { userId } = req.body;
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: parseInt(userId),
          commentId: parseInt(req.params.id),
        },
      },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllComments, getCommentById, createComment,
  updateComment, deleteComment, likeComment, unlikeComment,
};