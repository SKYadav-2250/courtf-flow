// judgeRoutes.js
import express from "express";
const router = express.Router();
import Judge from "../models/judgeModel.js"; // ✅ Mongoose model import
import JudgesController from "../controllers/judgesController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { registerUser } from "../controllers/authController.js";

// ✅ Create controller instance with the model
const judgesController = new JudgesController(Judge);


router.post("/", protect, authorizeRoles('admin'), (req, res) => judgesController.createJudge(req, res));
// router.post('/', protect, authorizeRoles('admin'), registerUser);
router.get("/", protect, (req, res) => judgesController.getJudges(req, res));
router.get("/:id", protect, (req, res) => judgesController.getJudgeById(req, res));
router.put("/:id", protect,authorizeRoles('admin','judge'), (req, res) => judgesController.updateJudge(req, res));
router.delete("/:id", protect,authorizeRoles('admin'), (req, res) => judgesController.deleteJudge(req, res));

export default router;
