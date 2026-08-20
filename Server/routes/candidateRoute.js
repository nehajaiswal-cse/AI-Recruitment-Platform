import express from "express";

import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  updateCandidateStatus,
  deleteCandidate,
  createManualCandidate
} from "../controllers/candidateController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/manual",
  authMiddleware,
  createManualCandidate
);

// Create candidate from application
router.post("/", authMiddleware, createCandidate);

// Get all candidates for logged-in recruiter
router.get("/", authMiddleware, getCandidates);

// Get single candidate
router.get("/:id", authMiddleware, getCandidateById);

// Update candidate
router.put("/:id", authMiddleware, updateCandidate);

// Update candidate status
router.patch("/:id/status", authMiddleware, updateCandidateStatus);

// Delete candidate
router.delete("/:id", authMiddleware, deleteCandidate);

export default router;