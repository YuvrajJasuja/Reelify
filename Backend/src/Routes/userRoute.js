const express = require('express');
const userController = require('../Controllers/userController');
const authUserMiddleware = require('../Middleware/userMiddleware');
const router=express.Router();

router.post('/user/createUser', userController.createUser)
router.post('/user/login', userController.loginUser)
router.get('/user/logout',authUserMiddleware,userController.logoutUser)
router.get('/user/me', authUserMiddleware, userController.getMe)

// Google OAuth routes
router.get('/auth/google', userController.googleAuthRedirect)
router.get('/auth/google/callback', userController.googleAuthCallback)

module.exports=router;