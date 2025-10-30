const express = require('express');
const router = express.Router();

// ✅ Import model and controller
const Courtroom = require('../models/courtroomModel');
const CourtroomsController = require('../controllers/CourtroomsController');

// ✅ Instantiate controller with model
const courtroomController = new CourtroomsController(Courtroom);

// ✅ Define routes
router.post('/', (req, res) => courtroomController.createCourtroom(req, res));
router.get('/', (req, res) => courtroomController.getCourtrooms(req, res));
router.get('/:id', (req, res) => courtroomController.getCourtroomById(req, res));
router.put('/:id', (req, res) => courtroomController.updateCourtroom(req, res));
router.delete('/:id', (req, res) => courtroomController.deleteCourtroom(req, res));

module.exports = router;
