const express = require('express');
const reelController = require('../Controllers/reelController');
const authUserMiddleware = require('../Middleware/userMiddleware');
const upload = require('../Middleware/uploadMiddleware');
const router=express.Router();

router.post('/reel/upload', authUserMiddleware, upload.single('video'), reelController.createReel);
router.get('/reels', reelController.getReels);
router.get('/reel/:reelId', reelController.getReelById);
router.get('/reels/user/:userId', reelController.getUserReels);

module.exports=router;