import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const VALID_ROLES = ['admin', 'judge', 'lawyer', 'clerk'];

function generateToken(user) {
  try {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      throw new Error('JWT configuration is missing');
    }

    return jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        number: user.number,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  } catch (error) {
    throw new Error('Failed to generate authentication token');
  }
}


export const registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { username, email, number, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !number || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields (username, email, password, number, and role) are required.' 
      });
    }

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` 
      });
    }

    // Check for existing user with email or number
    const existingUser = await User.findOne({
      $or: [
        { email },
        { number },
        { username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this username, email, or phone number already exists.' 
      });
    }

    // Create new user
    const newUser = await User.create([{
      username,
      email,
      password,
      number,
      role
    }], { session });

    // Generate token
    const token = generateToken(newUser[0]);

    await session.commitTransaction();

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: newUser[0]._id,
        username: newUser[0].username,
        email: newUser[0].email,
        role: newUser[0].role,
        number: newUser[0].number,
        createdAt: newUser[0].createdAt,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Duplicate field value entered' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Registration failed.', 
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};

// Login an existing user and return JWT
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required.' 
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    // Generic error message for security
    const invalidCredentialsMessage = 'Invalid email or password.';

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: invalidCredentialsMessage 
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: invalidCredentialsMessage 
      });
    }

    // Generate authentication token
    const token = generateToken(user);

    // Remove sensitive data from response
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      number: user.number,
      role: user.role,
      createdAt: user.createdAt,
    };

    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login. Please try again.' 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // require authentication + admin role
    // if (!req.user || req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    // }

    const users = await User.find().select('-password');
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users.', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // admin only
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user.', error: error.message });
  }
};

export const deleteMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const deleted = await User.findByIdAndDelete(req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'Your account has been deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete account.', error: error.message });
  }
};


