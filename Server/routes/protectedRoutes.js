import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Recruiter",
      user: req.user,
    });
  }
);

router.get(
  "/applicant",
  authMiddleware,
  roleMiddleware("applicant"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Applicant",
      user: req.user,
    });
  }
);

export default router;