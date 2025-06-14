const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/profile/:id', auth, userController.getProfile);
router.put('/profile/:id', auth, userController.updateProfile);
router.post('/follow/:id', auth, userController.followUser);
router.post('/unfollow/:id', auth, userController.unfollowUser);

module.exports = router; 