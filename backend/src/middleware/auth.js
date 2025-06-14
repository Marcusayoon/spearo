const { auth } = require('express-oauth2-jwt-bearer');
const User = require('../models/User');

// Auth0 configuration
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// Middleware to check if user exists in our database
const checkUser = async (req, res, next) => {
  try {
    const auth0Id = req.auth.payload.sub;
    let user = await User.findOne({ auth0Id });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        auth0Id,
        email: req.auth.payload.email,
        username: req.auth.payload.nickname || req.auth.payload.email.split('@')[0]
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = [jwtCheck, checkUser]; 