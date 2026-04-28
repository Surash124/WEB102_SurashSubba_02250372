const prisma = require('../lib/prisma');

const getAllVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        user: { select: { username: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const formatted = videos.map((v) => ({
      ...v,
      username: v.user.username,
      caption: v.description || v.title,
      audio: `Original Sound - ${v.user.username}`,
      likes: Array(v._count.likes).fill(0),
      comments: v._count.comments,
      shares: 0,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { username: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json({
      ...video,
      username: video.user.username,
      caption: video.description || video.title,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createVideo = async (req, res) => {
  try {
    const { title, description, url, userId } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : (url || '');

    if (!title || !userId) {
      return res.status(400).json({ error: 'Title and userId are required' });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || title,
        url: videoUrl,
        userId: parseInt(userId),
      },
      include: { user: { select: { username: true } } },
    });

    res.status(201).json({
      ...video,
      username: video.user.username,
      caption: video.description,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    const video = await prisma.video.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description, url },
    });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    await prisma.video.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getVideoComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { videoId: parseInt(req.params.id) },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(
      comments.map((c) => ({ ...c, username: c.user.username }))
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getVideoLikes = async (req, res) => {
  try {
    const likes = await prisma.like.findMany({
      where: { videoId: parseInt(req.params.id) },
      include: { user: { select: { id: true, username: true } } },
    });
    res.status(200).json(likes.map((l) => l.user));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const likeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    await prisma.like.create({
      data: {
        userId: parseInt(userId),
        videoId: parseInt(req.params.id),
      },
    });
    res.status(201).json({ message: 'Video liked successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Already liked this video' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const unlikeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    await prisma.like.delete({
      where: {
        userId_videoId: {
          userId: parseInt(userId),
          videoId: parseInt(req.params.id),
        },
      },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllVideos, getVideoById, createVideo, updateVideo,
  deleteVideo, getVideoComments, getVideoLikes, likeVideo, unlikeVideo,
};