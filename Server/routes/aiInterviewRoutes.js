import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import requireFeature from "../middlewares/requireFeature.js";

import {
  startAiInterview,
  submitAnswer,
  completeAiInterview,
  getAiInterviewById,
  getAiInterviewHistory,
} from "../controllers/aiInterviewController.js";

const router = express.Router();

// Every route: logged in + applicant
router.use(authMiddleware, roleMiddleware("applicant"));

// Only starting a NEW AI interview requires the free-limit / Pro check
router.post(
  "/start",
  requireFeature("ai_interview"),
  startAiInterview
);

// Existing interview actions remain accessible
router.post("/:id/answer", submitAnswer);

router.post("/:id/complete", completeAiInterview);

router.get("/history", getAiInterviewHistory);

router.get("/:id", getAiInterviewById);

export default router;