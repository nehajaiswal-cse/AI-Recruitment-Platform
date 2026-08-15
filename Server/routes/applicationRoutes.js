import express from "express";
import { applyForJob , getMyApplications, getJobApplications, updateApplicationStatus} from "../controllers/applicationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("applicant"),
  upload.single("resume"),
  applyForJob
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("applicant"),
  getMyApplications
);

router.get(
  "/job/:jobId",
  authMiddleware,
  roleMiddleware("recruiter"),
  getJobApplications
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateApplicationStatus
);

export default router;