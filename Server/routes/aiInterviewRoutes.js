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

// Every route below: must be logged in, must be an applicant,
// must have the "ai_interview" premium entitlement.
router.use(authMiddleware, roleMiddleware("applicant"), requireFeature("ai_interview"));

router.post("/start", startAiInterview);
router.post("/:id/answer", submitAnswer);
router.post("/:id/complete", completeAiInterview);
router.get("/history", getAiInterviewHistory);
router.get("/:id", getAiInterviewById);

export default router;