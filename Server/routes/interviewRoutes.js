import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterviewStatus,
  getRecruiterInterviews,
  updateInterview,
  deleteInterview
} from "../controllers/interviewController.js";

const router = express.Router();

// Recruiter → Schedule Interview
router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter"),
  createInterview
);

// Applicant → Get My Interviews
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("applicant"),
  getMyInterviews
);

router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterInterviews
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("applicant"),
  getInterviewById
);

router.put(
  "/:interviewId",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateInterview
);

router.delete("/:interviewId", deleteInterview);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateInterviewStatus
);

export default router;