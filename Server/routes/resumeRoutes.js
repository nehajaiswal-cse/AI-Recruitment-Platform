import express from "express";
import {
  uploadResume,
  getMyResumes,
  getResumeSignedUrl,
  setDefaultResume,
  deleteResume,
} from "../controllers/resumeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import uploadResumeMiddleware from "../middlewares/uploadResume.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("applicant"),
  uploadResumeMiddleware.single("resume"),
  uploadResume
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("applicant"),
  getMyResumes
);

router.get(
  "/:id/url",
  authMiddleware,
  roleMiddleware("applicant"),
  getResumeSignedUrl
);

router.patch(
  "/:id/default",
  authMiddleware,
  roleMiddleware("applicant"),
  setDefaultResume
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("applicant"),
  deleteResume
);

export default router;