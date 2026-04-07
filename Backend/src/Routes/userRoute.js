const express = require('express');
const userController = require('../Controllers/userController');
const authUserMiddleware = require('../Middleware/userMiddleware');
const router=express.Router();

router.post('/user/createUser', userController.createUser)
router.post('/user/login', userController.loginUser)
router.get('/user/logout',authUserMiddleware,userController.logoutUser)

module.exports=router;