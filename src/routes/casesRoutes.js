import express from 'express';
const router = express.Router();

// ✅ Import model
import Case from '../models/caseModel.js';

// ✅ Import controller
import CasesController from '../controllers/casesController.js';

// ✅ Pass model when creating controller instance
const casesController = new CasesController(Case);

router.post('/', casesController.createCase.bind(casesController));
router.get('/', casesController.getCases.bind(casesController));
router.get('/:id', casesController.getCaseById.bind(casesController));
router.put('/:id', casesController.updateCase.bind(casesController));
router.delete('/:id', casesController.deleteCase.bind(casesController));

export default router;
