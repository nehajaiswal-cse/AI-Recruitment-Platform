import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    skills: {
      type: [String],
      required: true
    },

    experience: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number
      }
    },

    education: {
      type: String
    },

    location: {
      type: String
    },

    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time"
    },

    salary: {
      min: {
        type: Number
      },
      max: {
        type: Number
      },
      currency: {
        type: String,
        default: "INR"
      }
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },

    deadline: {
      type: Date
    }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;