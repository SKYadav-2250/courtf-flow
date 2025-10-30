const express = require('express');
const router = express.Router();

// ✅ Import model
const Case = require('../models/caseModel');

// ✅ Import controller
const CasesController = require('../controllers/casesController');

// ✅ Pass model when creating controller instance
const casesController = new CasesController(Case);

router.post('/', casesController.createCase.bind(casesController));
router.get('/', casesController.getCases.bind(casesController));
router.get('/:id', casesController.getCaseById.bind(casesController));
router.put('/:id', casesController.updateCase.bind(casesController));
router.delete('/:id', casesController.deleteCase.bind(casesController));

module.exports = router;
