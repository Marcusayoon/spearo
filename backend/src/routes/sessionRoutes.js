const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/', auth, sessionController.createSession);
router.get('/:id', auth, sessionController.getSession);
router.get('/user/:userId', auth, sessionController.getUserSessions);
router.get('/feed', auth, sessionController.getFeed);
router.post('/:id/like', auth, sessionController.toggleLike);
router.post('/:id/comment', auth, sessionController.addComment);

module.exports = router; 