import express from 'express';
const router = express.Router();
import ClerksController from '../controllers/clerkController.js';
import Clerk from '../models/clerkModel.js';

const clerksController = new ClerksController(Clerk);

router.post('/', (req, res) => clerksController.createClerk(req, res));
router.get('/', (req, res) => clerksController.getClerks(req, res));
router.get('/:id', (req, res) => clerksController.getClerkById(req, res));
router.put('/:id', (req, res) => clerksController.updateClerk(req, res));
router.delete('/:id', (req, res) => clerksController.deleteClerk(req, res));

export default router;
