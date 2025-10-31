import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

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

export default router;


