import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      default: "",
      trim: true,
    },
    degree: {
      type: String,
      default: "",
      trim: true,
    },
    field: {
      type: String,
      default: "",
      trim: true,
    },
    startYear: {
      type: String,
      default: "",
      trim: true,
    },
    endYear: {
      type: String,
      default: "",
      trim: true,
    },
    grade: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      default: "",
      trim: true,
    },
    startDate: {
      type: String,
      default: "",
      trim: true,
    },
    endDate: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    tech: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    issuer: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const resumeBuilderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    template: {
      type: String,
      enum: ["modern", "classic", "minimal"],
      default: "modern",
    },

    personal: {
      fullName: {
        type: String,
        default: "",
        trim: true,
      },
      email: {
        type: String,
        default: "",
        trim: true,
      },
      phone: {
        type: String,
        default: "",
        trim: true,
      },
      location: {
        type: String,
        default: "",
        trim: true,
      },
      linkedin: {
        type: String,
        default: "",
        trim: true,
      },
      github: {
        type: String,
        default: "",
        trim: true,
      },
      portfolio: {
        type: String,
        default: "",
        trim: true,
      },
    },

    summary: {
      type: String,
      default: "",
      trim: true,
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    experience: {
      type: [experienceSchema],
      default: [],
    },

    projects: {
      type: [projectSchema],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    certifications: {
      type: [certificationSchema],
      default: [],
    },

    achievements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ResumeBuilder = mongoose.model(
  "ResumeBuilder",
  resumeBuilderSchema
);

export default ResumeBuilder;