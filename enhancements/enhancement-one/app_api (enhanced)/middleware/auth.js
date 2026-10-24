const jwt = require('jsonwebtoken');

// Verify that the request contains a valid JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authorization token required'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      message: 'Authorization header must use Bearer token'
    });
  }

  const token = parts[1];

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.auth = verified;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

// Check whether the authenticated user has the required role
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRole
};