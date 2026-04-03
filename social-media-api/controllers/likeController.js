const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { likes, users, posts } = require('../utils/mockData');

// @desc    Get all likes
// @route   GET /api/likes
// @access  Public
exports.getLikes = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = likes.length;

  const results = likes.slice(startIndex, endIndex);

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

// @desc    Get single like
// @route   GET /api/likes/:id
// @access  Public
exports.getLike = asyncHandler(async (req, res, next) => {
  const like = likes.find(like => like.id === req.params.id);

  if (!like) {
    return next(
      new ErrorResponse(`Like not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: like
  });
});

// @desc    Like a post
// @route   POST /api/likes
// @access  Private
exports.createLike = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const user = users.find(user => user.id === userId);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const post = posts.find(post => post.id === req.body.post_id);
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Check if user already liked the post
  const existingLike = likes.find(
    like => like.post_id === req.body.post_id && like.user_id === userId
  );
  if (existingLike) {
    return next(new ErrorResponse('You have already liked this post', 400));
  }

  const newLike = {
    id: (likes.length + 1).toString(),
    post_id: req.body.post_id,
    user_id: userId,
    created_at: new Date().toISOString().slice(0, 10)
  };

  likes.push(newLike);

  res.status(201).json({
    success: true,
    data: newLike
  });
});

// @desc    Unlike a post
// @route   DELETE /api/likes/:id
// @access  Private
exports.deleteLike = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const like = likes.find(like => like.id === req.params.id);

  if (!like) {
    return next(
      new ErrorResponse(`Like not found with id of ${req.params.id}`, 404)
    );
  }

  if (like.user_id !== userId) {
    return next(new ErrorResponse('Not authorized to delete this like', 401));
  }

  const index = likes.findIndex(like => like.id === req.params.id);
  likes.splice(index, 1);

  res.status(200).json({
    success: true,
    data: {}
  });
});