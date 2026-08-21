import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    aiScore: {
      type: Number,
      min: 0,
      max: 100
    },

    aiAnalysis: {
      skillsMatch: Number,
      experienceMatch: Number,
      educationMatch: Number,
      summary: String
    },

    skills: [
      {
        type: String
      }
    ],

    experience: {
      type: Number
    },

    recruiterNotes: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "selected",
        "offered",
        "hired",
        "rejected"
      ],
      default: "applied"
    }
  },
  {
    timestamps: true
  }
);

const Candidate = mongoose.model(
  "Candidate",
  candidateSchema
);

export default Candidate;