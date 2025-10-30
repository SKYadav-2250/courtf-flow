const express = require('express');
const router = express.Router();
const ClerksController = require('../controllers/clerkController');
const Clerk = require('../models/clerkModel');

const clerksController = new ClerksController(Clerk);

router.post('/', (req, res) => clerksController.createClerk(req, res));
router.get('/', (req, res) => clerksController.getClerks(req, res));
router.get('/:id', (req, res) => clerksController.getClerkById(req, res));
router.put('/:id', (req, res) => clerksController.updateClerk(req, res));
router.delete('/:id', (req, res) => clerksController.deleteClerk(req, res));

module.exports = router;
