import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT from Authorization header and attach user to req
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized. Token missing.' 
      });
    }

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
    }



    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded token:`, decoded);

    // Fetch fresh user details
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized. User not found.' 
      });
    }

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    
    console.log(`Authenticated user: ${user.username} with role: ${user.role}`);
    return next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized. Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized. Token expired.' 
      });
    }

    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized. Authentication failed.' 
    });
  }
};

// Allow only specific roles to proceed
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized. No user found.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden. Required roles: ${allowedRoles.join(', ')}` 
      });
    }
    
    return next();
  };
};

// Optional: Check if user is authenticated without failing
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme === 'Bearer' && token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }
    }
    
    return next();
  } catch (error) {
    // Continue without authentication for optional auth
    return next();
  }
};