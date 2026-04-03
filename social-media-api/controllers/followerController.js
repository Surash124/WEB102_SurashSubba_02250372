const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { followers, users } = require('../utils/mockData');

// @desc    Get all followers
// @route   GET /api/followers
// @access  Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = followers.length;

  const results = followers.slice(startIndex, endIndex);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }

  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: results.length,
    page,
    total_pages: Math.ceil(total / limit),
    pagination,
    data: results
  });
});

// @desc    Get single follower
// @route   GET /api/followers/:id
// @access  Public
exports.getFollower = asyncHandler(async (req, res, next) => {
  const follower = followers.find(follower => follower.id === req.params.id);

  if (!follower) {
    return next(
      new ErrorResponse(`Follower not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: follower
  });
});

// @desc    Follow a user
// @route   POST /api/followers
// @access  Private
exports.createFollower = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const user = users.find(user => user.id === userId);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check if trying to follow yourself
  if (userId === req.body.following_id) {
    return next(new ErrorResponse('You cannot follow yourself', 400));
  }

  const userToFollow = users.find(user => user.id === req.body.following_id);
  if (!userToFollow) {
    return next(new ErrorResponse('User to follow not found', 404));
  }

  // Check if already following
  const existingFollow = followers.find(
    follower =>
      follower.follower_id === userId &&
      follower.following_id === req.body.following_id
  );
  if (existingFollow) {
    return next(new ErrorResponse('You are already following this user', 400));
  }

  const newFollower = {
    id: (followers.length + 1).toString(),
    follower_id: userId,
    following_id: req.body.following_id,
    created_at: new Date().toISOString().slice(0, 10)
  };

  followers.push(newFollower);

  res.status(201).json({
    success: true,
    data: newFollower
  });
});

// @desc    Unfollow a user
// @route   DELETE /api/followers/:id
// @access  Private
exports.deleteFollower = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const follower = followers.find(follower => follower.id === req.params.id);

  if (!follower) {
    return next(
      new ErrorResponse(`Follower not found with id of ${req.params.id}`, 404)
    );
  }

  if (follower.follower_id !== userId) {
    return next(new ErrorResponse('Not authorized to unfollow this user', 401));
  }

  const index = followers.findIndex(follower => follower.id === req.params.id);
  followers.splice(index, 1);

  res.status(200).json({
    success: true,
    data: {}
  });
});