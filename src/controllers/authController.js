import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import bcrypt from "bcrypt";

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
    console.log(`email  ${email} and password  ${password}`);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    console.log('request is coming');
    // Require authentication + admin role
    // if (!req.user) {
    //   return res.status(401).json({ 
    //     success: false, 
    //     message: 'Authentication required' 
    //   });
    // }

    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ 
    //     success: false, 
    //     message: 'Access denied. Admin privileges required.' 
    //   });
    // }

const users = await User.find()
  .select("-password -__v")
  .sort({ createdAt: -1 });

    return res.status(200).json({ 
      success: true, 
      count: users.length, 
      users 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users. Please try again.' 
    });
  }
};

export const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify authentication and admin role
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Find user first to get their role
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete the last admin user' 
        });
      }
    }

    // Soft delete by setting isActive to false
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, session }
    );

    // If user is a judge/lawyer/clerk, also update their role-specific record
    if (['judge', 'lawyer', 'clerk'].includes(user.role)) {
      const Model = mongoose.model(user.role.charAt(0).toUpperCase() + user.role.slice(1));
      await Model.findOneAndUpdate(
        { userId: id },
        { isActive: false },
        { session }
      );
    }

    await session.commitTransaction();

    return res.status(200).json({ 
      success: true, 
      message: 'User deactivated successfully' 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting user:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user. Please try again.' 
    });
  } finally {
    session.endSession();
  }
};

export const deleteMe = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Prevent admin from deleting their account if they're the last admin
    if (req.user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete the last admin account' 
        });
      }
    }

    // Soft delete by setting isActive to false
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { isActive: false },
      { new: true, session }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // If user is a judge/lawyer/clerk, also update their role-specific record
    if (['judge', 'lawyer', 'clerk'].includes(req.user.role)) {
      const Model = mongoose.model(req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1));
      await Model.findOneAndUpdate(
        { userId: req.user.id },
        { isActive: false },
        { session }
      );
    }

    await session.commitTransaction();

    // Clear the authentication cookie
    res.clearCookie('token');

    return res.status(200).json({ 
      success: true, 
      message: 'Your account has been deactivated successfully' 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deactivating account:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to deactivate account. Please try again.' 
    });
  } finally {
    session.endSession();
  }
};


