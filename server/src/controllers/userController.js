const prisma = require('../lib/prisma');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, username: true, email: true,
        name: true, bio: true, avatar: true, createdAt: true,
        _count: { select: { followers: true, following: true, videos: true } },
      },
    });
    const formatted = users.map((u) => ({
      ...u,
      followers: Array(u._count.followers).fill(0).map((_, i) => i),
      following: Array(u._count.following).fill(0).map((_, i) => i),
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, username: true, email: true,
        name: true, bio: true, avatar: true, createdAt: true,
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
        _count: { select: { videos: true } },
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      ...user,
      followers: user.followers.map((f) => f.followerId),
      following: user.following.map((f) => f.followingId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, bio } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, bio },
      select: { id: true, username: true, email: true, name: true, bio: true },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserVideos = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const videos = await prisma.video.findMany({
      where: { userId },
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
      likes: Array(v._count.likes).fill(0),
      comments: v._count.comments,
      shares: 0,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const follows = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });
    res.status(200).json(follows.map((f) => f.follower));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserFollowing = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });
    res.status(200).json(follows.map((f) => f.following));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const followUser = async (req, res) => {
  try {
    const userToFollowId = parseInt(req.params.id);
    const { followerId } = req.body;
    if (!followerId) return res.status(400).json({ error: 'followerId is required' });

    const followerIdInt = parseInt(followerId);
    if (userToFollowId === followerIdInt) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    await prisma.follow.create({
      data: { followerId: followerIdInt, followingId: userToFollowId },
    });
    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Already following this user' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const userToUnfollowId = parseInt(req.params.id);
    const { followerId } = req.body;
    const followerIdInt = parseInt(followerId);

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerIdInt,
          followingId: userToUnfollowId,
        },
      },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getFollowingVideos = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    const videos = await prisma.video.findMany({
      where: { userId: { in: followingIds } },
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
      likes: Array(v._count.likes).fill(0),
      comments: v._count.comments,
      shares: 0,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllUsers, getUserById, updateUser, deleteUser,
  getUserVideos, getUserFollowers, getUserFollowing,
  followUser, unfollowUser, getFollowingVideos,
};