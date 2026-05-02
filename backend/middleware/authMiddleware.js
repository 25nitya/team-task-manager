const jwt = require('jsonwebtoken');

// This function checks the token and lets the request continue
const auth = (req, res, next) => {
  // 1. Get token from header
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user data to the request object
    req.user = decoded; 
    
    next(); // Move to the next step (The Route)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;