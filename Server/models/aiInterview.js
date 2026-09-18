import mongoose from "mongoose";

const qaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const aiInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: { type: String, required: true },
    type: {
      type: String,
      enum: ["Technical", "HR", "Mixed"],
      required: true,
    },

    questions: [qaSchema],

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    evaluation: {
      overallScore: { type: Number },
      technicalKnowledge: { type: Number },
      problemSolving: { type: Number },
      communication: { type: Number },
      relevance: { type: Number },
      strengths: [String],
      areasToImprove: [String],
      recommendations: [String],
    },
  },
  { timestamps: true }
);

const AiInterview = mongoose.model("AiInterview", aiInterviewSchema);

export default AiInterview;