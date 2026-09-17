import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import requireFeature from "../middlewares/requireFeature.js";

import { analyzeResumeForOptimization } from "../controllers/resumeOptimizerController.js";

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  roleMiddleware("applicant"),
  requireFeature("ai_resume_optimization"),
  analyzeResumeForOptimization
);

export default router;