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
// ==========================================
// No auth middleware here. Razorpay calls this endpoint directly.
// app.js applies express.raw() to this exact endpoint BEFORE express.json().
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
