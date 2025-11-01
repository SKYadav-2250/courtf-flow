import express from 'express';
const router = express.Router();

// ✅ Import model and controller
import Courtroom from '../models/courtroomModel.js';
import CourtroomsController from '../controllers/courtroomsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';

// ✅ Instantiate controller with model
const courtroomController = new CourtroomsController(Courtroom);

// ✅ Define routes
router.post('/', protect, authorizeRoles('admin', 'clerk'), (req, res) => courtroomController.createCourtroom(req, res));
router.get('/', protect, (req, res) => courtroomController.getCourtrooms(req, res));
router.get('/:id', protect, (req, res) => courtroomController.getCourtroomById(req, res));
router.put('/:id', protect, authorizeRoles('admin', 'clerk'), (req, res) => courtroomController.updateCourtroom(req, res));
router.delete('/:id', protect, authorizeRoles('admin', 'clerk'), (req, res) => courtroomController.deleteCourtroom(req, res));

export default router;
