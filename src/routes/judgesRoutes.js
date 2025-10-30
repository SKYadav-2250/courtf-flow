// judgeRoutes.js
const express = require("express");
const router = express.Router();
const Judge = require("../models/judgeModel"); // ✅ Mongoose model import
const JudgesController = require("../controllers/JudgesController");

// ✅ Create controller instance with the model
const judgesController = new JudgesController(Judge);

// ✅ Use controller methods as route handlers
router.post("/", (req, res) => judgesController.createJudge(req, res));
router.get("/", (req, res) => judgesController.getJudges(req, res));
router.get("/:id", (req, res) => judgesController.getJudgeById(req, res));
router.put("/:id", (req, res) => judgesController.updateJudge(req, res));
router.delete("/:id", (req, res) => judgesController.deleteJudge(req, res));

module.exports = router;
