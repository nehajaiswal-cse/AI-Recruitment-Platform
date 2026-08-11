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

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);