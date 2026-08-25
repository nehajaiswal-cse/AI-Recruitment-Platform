import express from "express";
import { analyzeResume } from "../controllers/atsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  roleMiddleware("applicant"),
  analyzeResume
);

export default router;