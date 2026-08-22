import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import { getRecruiterAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// router.get(
//   "/recruiter",
//   authMiddleware,
//   roleMiddleware("recruiter"),
//   getRecruiterAnalytics
// );

router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterAnalytics
);

export default router;