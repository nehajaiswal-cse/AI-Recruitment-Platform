import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true
    },

    phone: {
      type: String
    },

    profile: {
      skills: [String],
      experience: Number,
      education: String,
      location: String,
      companyName: String,
      companyWebsite: String,
      companyDescription: String
    },

    // ---- Settings page fields (new) ----
    jobPreferences: {
      preferredRole: { type: String, default: "" },
      preferredLocation: { type: String, default: "" },
      workMode: {
        type: String,
        enum: ["Remote", "Hybrid", "On-site"],
        default: "Hybrid"
      },
      expectedSalary: { type: String, default: "" },
      experienceLevel: {
        type: String,
        enum: ["Fresher", "Mid level (2-4 yrs)", "Senior (5+ yrs)"],
        default: "Fresher"
      },
      employmentType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship"],
        default: "Full-time"
      }
    },

    notifications: {
      jobRecommendations: { type: Boolean, default: true },
      newJobAlerts: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      recruiterMessages: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false }
    },

    privacy: {
      profileVisibility: {
        type: String,
        enum: ["Public", "Recruiters only", "Private"],
        default: "Public"
      },
      resumeVisibility: {
        type: String,
        enum: ["Everyone", "Recruiters only", "No one"],
        default: "Recruiters only"
      },
      twoFactorEnabled: { type: Boolean, default: false }
    },
    // ---- end settings fields ----

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;