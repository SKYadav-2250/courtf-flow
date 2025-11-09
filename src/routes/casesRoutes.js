import express from 'express';
const router = express.Router();

// ✅ Import model
import Case from '../models/caseModel.js';

// ✅ Import controller
import CasesController from '../controllers/casesController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

// ✅ Pass model when creating controller instance
const casesController = new CasesController(Case);

router.post('/', protect, authorizeRoles('admin', 'clerk'), casesController.createCase.bind(casesController));
router.get('/', casesController.getCases.bind(casesController));
router.get('/:id', protect, casesController.getCaseById.bind(casesController));
router.put('/:id', protect, authorizeRoles('admin', 'clerk'), casesController.updateCase.bind(casesController));
router.delete('/:id', protect, authorizeRoles('admin', 'clerk'), casesController.deleteCase.bind(casesController));

export default router;
