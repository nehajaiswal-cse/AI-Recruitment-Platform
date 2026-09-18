import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Technical Interview",
        "HR Interview",
        "Managerial Interview",
      ],
      required: true,
    },

    interviewer: {
      type: String,
      required: true,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Confirmed",
        "Pending",
        "Completed",
        "Cancelled",
      ],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;