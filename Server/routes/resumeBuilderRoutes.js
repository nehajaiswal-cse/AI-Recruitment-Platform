import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  getMyBuilderResume,
  createBuilderResume,
  updateBuilderResume,
  exportBuilderResume,
} from "../controllers/resumeBuilderController.js";

const router = express.Router();

// Get logged-in applicant's builder resume
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("applicant"),
  getMyBuilderResume
);

router.post(
  "/export",
  authMiddleware,
  roleMiddleware("applicant"),
  exportBuilderResume
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("applicant"),
  updateBuilderResume
);

export default router;