import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import Candidate from "./routes/candidateRoute.js";
import interview from "./routes/interviewRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";


const app = express();

app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true 
}))

app.use(express.json());
app.use("/api", protectedRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/candidates",Candidate)
app.use("/api/interviews",interview)
app.use("/api/interviews", interviewRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Recruitment Platform API is running",
  });
});

app.get("/home", (req, res) => {
  res.json({
    success: true,
    message: "AI Recruitment Platform API is running"
  });
});

app.use("/api/auth", authRoutes);

export default app;