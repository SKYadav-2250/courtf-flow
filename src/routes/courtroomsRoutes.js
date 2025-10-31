import express from 'express';
const router = express.Router();

// ✅ Import model and controller
import Courtroom from '../models/courtroomModel.js';
import CourtroomsController from '../controllers/CourtroomsController.js';

// ✅ Instantiate controller with model
const courtroomController = new CourtroomsController(Courtroom);

// ✅ Define routes
router.post('/', (req, res) => courtroomController.createCourtroom(req, res));
router.get('/', (req, res) => courtroomController.getCourtrooms(req, res));
router.get('/:id', (req, res) => courtroomController.getCourtroomById(req, res));
router.put('/:id', (req, res) => courtroomController.updateCourtroom(req, res));
router.delete('/:id', (req, res) => courtroomController.deleteCourtroom(req, res));

export default router;
