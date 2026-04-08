const express = require('express');
const reelController = require('../Controllers/reelController');
const authUserMiddleware = require('../Middleware/userMiddleware');
const router=express.Router();

router.post('/reel/upload',authUserMiddleware,reelController.createReel);

module.exports=router;