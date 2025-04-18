import jwt from 'jsonwebtoken';

const AuthenticationMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: 'No token provided',
      },
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error: {
          code: 401,
          message: 'Failed to authenticate token',
        },
      });
    }

    req.user = decoded; // Attach user info to request
    next();
  });
};

export default AuthenticationMiddleware;