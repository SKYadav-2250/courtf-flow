import express from "express";
const router = express.Router();
import Lawyer from "../models/lawyerModel.js";
import LawyersController from "../controllers/LawyersController.js";

const lawyersController = new LawyersController(Lawyer);

router.post("/", (req, res) => lawyersController.createLawyer(req, res));
router.get("/", (req, res) => lawyersController.getLawyers(req, res));
router.get("/:id", (req, res) => lawyersController.getLawyerById(req, res));
router.put("/:id", (req, res) => lawyersController.updateLawyer(req, res));
router.delete("/:id", (req, res) => lawyersController.deleteLawyer(req, res));

export default router;
