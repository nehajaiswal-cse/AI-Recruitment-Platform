import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import Candidate from "./routes/candidateRoute.js";
import interview from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import recruiterSettingsRoutes from "./routes/recruiterSettingsRoutes.js";
import resumeBuilderRoutes from "./routes/resumeBuilderRoutes.js";
import aiInterviewRoutes from "./routes/aiInterviewRoutes.js";
import resumeOptimizerRoutes from "./routes/resumeOptimizerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// ==========================================
// CORS
// ==========================================


import copilotRoutes from "./routes/copilotRoutes.js"


app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174",process.env.CLIENT_URL],
  credentials: true 
}))

// ==========================================
// RAZORPAY WEBHOOK RAW BODY
// ==========================================
// IMPORTANT: This must run BEFORE express.json() for this exact route.
// Razorpay webhook signature verification requires the original raw body.
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

// ==========================================
// NORMAL JSON BODY PARSER
// ==========================================
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================
app.use("/api", protectedRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/candidates", Candidate);
app.use("/api/interviews", interview);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/recruiter/settings", recruiterSettingsRoutes);
app.use("/api/resume-builder", resumeBuilderRoutes);
app.use("/api/copilot",copilotRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Recruitment Platform API is running",
  });
});

app.get("/home", (req, res) => {
  res.json({
    success: true,
    message: "AI Recruitment Platform API is running",
  });
});

app.use("/api/auth", authRoutes);

export default app;
