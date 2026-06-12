const express = require('express');
const profileController = require('../Controllers/profileController');
const authUserMiddleware = require('../Middleware/userMiddleware');
const router = express.Router();

router.get('/profile', authUserMiddleware, profileController.getProfile);
router.put('/profile', authUserMiddleware, profileController.updateProfile);

module.exports = router;
