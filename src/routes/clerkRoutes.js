import express from 'express';
const router = express.Router();
import ClerksController from '../controllers/clerkController.js';
import Clerk from '../models/clerkModel.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const clerksController = new ClerksController(Clerk);

router.post('/', protect, authorizeRoles('admin'), (req, res) => clerksController.createClerk(req, res));
router.get('/', protect, (req, res) => clerksController.getClerks(req, res));
router.get('/:id', protect, (req, res) => clerksController.getClerkById(req, res));
router.put('/:id', protect, (req, res) => clerksController.updateClerk(req, res));
router.delete('/:id', protect, (req, res) => clerksController.deleteClerk(req, res));

export default router;
