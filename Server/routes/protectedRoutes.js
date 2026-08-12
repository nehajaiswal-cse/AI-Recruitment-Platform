import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user,
  });
});

router.get(
  "/recruiter-dashboard",
  authMiddleware,
  roleMiddleware("recruiter"),
  (req, res) => {
    res.json({
      message: "Welcome Recruiter!",
      user: req.user,
    });
  }
);

export default router;