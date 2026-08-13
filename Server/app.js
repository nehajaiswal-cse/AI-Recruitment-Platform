import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", protectedRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/home", (req, res) => {
  res.json({
    success: true,
    message: "AI Recruitment Platform API is running"
  });
});

app.use("/api/auth", authRoutes);

export default app;