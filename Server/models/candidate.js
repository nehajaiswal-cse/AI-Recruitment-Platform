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
      matchingSkills: {
       type: [String],
       default: []
      },

      missingSkills: {
       type: [String],
       default: []
      },

      experienceAnalysis: {
        type: String,
        default: ""
      },

      educationAnalysis: {
        type: String,
        default: ""
      },

      strengths: {
       type: [String],
       default: []
      },

      weaknesses: {
        type: [String],
        default: []
      },

      summary: {
       type: String,
       default: ""
      },

      recommendation: {
        type: String,
        enum: ["Shortlist", "Consider", "Reject"],
        default: "Consider"
      }
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

const Candidate =
  mongoose.models.Candidate ||
  mongoose.model("Candidate", candidateSchema);


export default Candidate;