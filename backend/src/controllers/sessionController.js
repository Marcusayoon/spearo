const Session = require('../models/Session');
const User = require('../models/User');

// Create new session
exports.createSession = async (req, res) => {
  try {
    const session = new Session({
      ...req.body,
      user: req.user.id
    });
    
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get session by ID
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('likes', 'username')
      .populate('comments.user', 'username profilePicture');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's sessions
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.params.userId })
      .sort({ date: -1 })
      .populate('user', 'username profilePicture');
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feed (sessions from followed users)
exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const sessions = await Session.find({
      user: { $in: [...user.following, req.user.id] }
    })
      .sort({ date: -1 })
      .populate('user', 'username profilePicture')
      .limit(20);
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike session
exports.toggleLike = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    const likeIndex = session.likes.indexOf(req.user.id);
    
    if (likeIndex === -1) {
      session.likes.push(req.user.id);
    } else {
      session.likes.splice(likeIndex, 1);
    }
    
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    session.comments.push({
      user: req.user.id,
      text: req.body.text
    });
    
    await session.save();
    
    const populatedSession = await Session.findById(req.params.id)
      .populate('comments.user', 'username profilePicture');
    
    res.json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 