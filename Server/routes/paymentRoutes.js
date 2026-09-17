import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  createSubscription,
  verifySubscription,
  razorpayWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// ==========================================
// RAZORPAY WEBHOOK
// IMPORTANT:
// app.js applies express.raw() before this route
// ==========================================
router.post("/webhook", razorpayWebhook);

// ==========================================
// PROTECTED APPLICANT PAYMENT ROUTES
// ==========================================
router.post(
  "/create-subscription",
  authMiddleware,
  roleMiddleware("applicant"),
  createSubscription
);

router.post(
  "/verify-subscription",
  authMiddleware,
  roleMiddleware("applicant"),
  verifySubscription
);

export default router;