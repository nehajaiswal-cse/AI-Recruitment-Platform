import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    resume: {
      fileName: {
        type: String,
        required: true
      },
      fileUrl: {
        type: String,
        required: true
      }
    },

    coverLetter: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "rejected",
        "hired"
      ],
      default: "applied"
    }
  },
  {
    timestamps: true
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;