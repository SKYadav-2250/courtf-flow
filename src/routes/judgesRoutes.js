// judgeRoutes.js
import express from "express";
const router = express.Router();
import Judge from "../models/judgeModel.js"; // ✅ Mongoose model import
import JudgesController from "../controllers/JudgesController.js";

// ✅ Create controller instance with the model
const judgesController = new JudgesController(Judge);

// ✅ Use controller methods as route handlers
router.post("/", (req, res) => judgesController.createJudge(req, res));
router.get("/", (req, res) => judgesController.getJudges(req, res));
router.get("/:id", (req, res) => judgesController.getJudgeById(req, res));
router.put("/:id", (req, res) => judgesController.updateJudge(req, res));
router.delete("/:id", (req, res) => judgesController.deleteJudge(req, res));

export default router;
