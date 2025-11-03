import jwt from 'jsonwebtoken';
import User from '../models/User.js';




function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      number:user.number,
      role: user.role,
    },
   process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}


export const registerUser = async (req, res) => {
  try {
    const { username, email,number, password, role } = req.body;
    console.log(`user  ${JSON.stringify(req.user)}`);

    if (!username || !email || !password || !number) {
      return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }]
    });

    
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'user number or email already exists.' });
    }
    
 
    const newUser = await User.create({ username, email, password, number, role });
   

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        number:newUser.number,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed.', error: error.message });
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
    // require authentication + admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin only' });
    }

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


