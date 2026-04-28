const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const videoController = require('../controllers/videoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/', videoController.getAllVideos);
router.post('/', upload.single('video'), videoController.createVideo);
router.get('/:id', videoController.getVideoById);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);
router.get('/:id/comments', videoController.getVideoComments);
router.get('/:id/likes', videoController.getVideoLikes);
router.post('/:id/likes', videoController.likeVideo);
router.delete('/:id/likes', videoController.unlikeVideo);

module.exports = router;