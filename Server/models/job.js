import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // BASIC INFORMATION
    // =========================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    jobType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Internship",
        "Contract",
        "Remote",
      ],
      default: "Full-time",
    },

    experience: {
      type: String,
      trim: true,
    },

    salary: {
      type: String,
      trim: true,
    },

    // =========================
    // JOB DESCRIPTION
    // =========================

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: {
      type: String,
      trim: true,
    },

    // =========================
    // SKILLS
    // =========================

    skills: {
      type: [String],
      default: [],
    },

    // =========================
    // JOB STATUS
    // =========================

    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "published",
    },

    // =========================
    // DEADLINE
    // =========================

    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;