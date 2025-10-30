const express = require("express");
const router = express.Router();
const Lawyer = require("../models/lawyerModel");
const LawyersController = require("../controllers/LawyersController");

const lawyersController = new LawyersController(Lawyer);

router.post("/", (req, res) => lawyersController.createLawyer(req, res));
router.get("/", (req, res) => lawyersController.getLawyers(req, res));
router.get("/:id", (req, res) => lawyersController.getLawyerById(req, res));
router.put("/:id", (req, res) => lawyersController.updateLawyer(req, res));
router.delete("/:id", (req, res) => lawyersController.deleteLawyer(req, res));

module.exports = router;
