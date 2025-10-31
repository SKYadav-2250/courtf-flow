import express from 'express';
const router = express.Router();

// ✅ Import model
import Case from '../models/caseModel.js';

// ✅ Import controller
import CasesController from '../controllers/casesController.js';
import { protect } from '../middleware/authMiddleware.js';

// ✅ Pass model when creating controller instance
const casesController = new CasesController(Case);

router.post('/', protect, casesController.createCase.bind(casesController));
router.get('/', protect, casesController.getCases.bind(casesController));
router.get('/:id', protect, casesController.getCaseById.bind(casesController));
router.put('/:id', protect, casesController.updateCase.bind(casesController));
router.delete('/:id', protect, casesController.deleteCase.bind(casesController));

export default router;
