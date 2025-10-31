import express from "express";
const router = express.Router();
import Lawyer from "../models/lawyerModel.js";
import LawyersController from "../controllers/lawyersController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const lawyersController = new LawyersController(Lawyer);

router.post("/", protect, authorizeRoles('admin'), (req, res) => lawyersController.createLawyer(req, res));
router.get("/", protect, (req, res) => lawyersController.getLawyers(req, res));
router.get("/:id", protect, (req, res) => lawyersController.getLawyerById(req, res));
router.put("/:id", protect,authorizeRoles('admin','lawyer'), (req, res) => lawyersController.updateLawyer(req, res));
router.delete("/:id", protect,authorizeRoles('admin'), (req, res) => lawyersController.deleteLawyer(req, res));

export default router;
