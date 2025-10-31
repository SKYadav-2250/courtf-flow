import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  deleteMe
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register (admin only)
router.post('/register', protect, authorizeRoles('admin'), registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/profile (Protected)
router.get('/profile', protect, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User profile fetched successfully.',
    user: req.user,
  });
});

// GET /api/auth/users (admin only) - fetch all users
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);

// DELETE /api/auth/users/:id (admin only) - delete user by id
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);

// DELETE /api/auth/me (authenticated user) - delete own account
router.delete('/me', protect , deleteMe);

export default router;


