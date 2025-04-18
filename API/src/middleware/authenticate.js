import jwt from 'jsonwebtoken';
import redis from '../config/redis.js';

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: 'Please authenticate.'
      }
    });
  }
};

export default authenticate;