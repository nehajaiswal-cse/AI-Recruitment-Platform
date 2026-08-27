import mongoose from "mongoose";

const recruiterSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    account: {
      jobTitle: { type: String, default: "" },
      companyName: { type: String, default: "" },
      companyEmail: { type: String, default: "" },
      profilePhoto: { type: String, default: "" },
    },

    companyPreferences: {
      companyName: { type: String, default: "" },
      companyWebsite: { type: String, default: "" },
      industry: { type: String, default: "" },

      companySize: {
        type: String,
        enum: ["1 - 50", "51 - 200", "201 - 500", "500+"],
        default: "1 - 50",
      },

      recruiterDesignation: { type: String, default: "" },
      defaultJobLocation: { type: String, default: "" },

      defaultWorkMode: {
        type: String,
        enum: ["On-site", "Hybrid", "Remote"],
        default: "Hybrid",
      },

      defaultEmploymentType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Internship"],
        default: "Full-time",
      },

      preferredExperienceRange: {
        type: String,
        enum: ["0 - 3 years", "3 - 5 years", "5 - 10 years", "10+ years"],
        default: "0 - 3 years",
      },

      preferredEducationLevel: {
        type: String,
        enum: ["Any", "Bachelor's Degree", "Master's Degree", "PhD"],
        default: "Any",
      },

      preferredSkills: {
        type: [String],
        default: [],
        validate: {
          validator: (skills) => skills.length <= 10,
          message: "You can add up to 10 skills only",
        },
      },
    },

    notifications: {
      newApplications: { type: Boolean, default: true },
      applicationStatusUpdates: { type: Boolean, default: true },
      interviewReminders: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      newJobAlerts: { type: Boolean, default: true },
      candidateMessages: { type: Boolean, default: true },
      aiScreeningCompleted: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
    },

    aiPreferences: {
      aiCandidateMatching: { type: Boolean, default: true },
      autoRankCandidates: { type: Boolean, default: true },
      aiResumeScreening: { type: Boolean, default: true },
      autoHighlightSkills: { type: Boolean, default: true },
      interviewQuestionSuggestions: { type: Boolean, default: true },
      jobDescriptionSuggestions: { type: Boolean, default: true },

      minMatchingScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 70,
      },

      minAtsScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 70,
      },
    },

    hiringPreferences: {
      defaultJobVisibility: {
        type: String,
        enum: ["Public", "Private", "Company only"],
        default: "Public",
      },

      defaultApplicationDeadline: {
        type: String,
        enum: ["15 days", "30 days", "45 days", "60 days"],
        default: "30 days",
      },

      automaticallyPublishJobs: { type: Boolean, default: true },
      allowResumeDownload: { type: Boolean, default: true },
      allowCandidateMessaging: { type: Boolean, default: true },
      enableAiScreeningForNewJobs: { type: Boolean, default: true },
    },

    privacy: {
      profileVisibility: {
        type: String,
        enum: ["Public", "Company only", "Private"],
        default: "Company only",
      },

      whoCanViewCandidateData: {
        type: String,
        enum: ["Only me", "Team members", "Entire company"],
        default: "Team members",
      },

      twoFactorEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const RecruiterSettings = mongoose.model(
  "RecruiterSettings",
  recruiterSettingsSchema
);

export default RecruiterSettings;