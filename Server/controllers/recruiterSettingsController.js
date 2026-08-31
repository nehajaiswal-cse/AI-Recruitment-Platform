import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.js";
import RecruiterSettings from "../models/recruiterSettings.js";

const getUserId = (req) => req.user?.id;

const getOrCreateSettings = async (user) => {
  let settings = await RecruiterSettings.findOne({ userId: user._id });

  if (!settings) {
    settings = await RecruiterSettings.create({
      userId: user._id,
      account: {
        jobTitle: "",
        companyName: user.profile?.companyName || "",
        companyEmail: user.email || "",
      },
      companyPreferences: {
        companyName: user.profile?.companyName || "",
        companyWebsite: user.profile?.companyWebsite || "",
        defaultJobLocation: user.profile?.location || "",
        preferredSkills: user.profile?.skills || [],
      },
    });
  }

  return settings;
};

const responseShape = (user, settings) => ({
  account: {
    fullName: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    jobTitle: settings.account?.jobTitle || "",
    companyName:
      settings.account?.companyName ||
      settings.companyPreferences?.companyName ||
      user.profile?.companyName ||
      "",
    companyEmail: settings.account?.companyEmail || "",
    profilePhoto: settings.account?.profilePhoto || "",
  },
  prefs: settings.companyPreferences.toObject(),
  skills: settings.companyPreferences?.preferredSkills || [],
  notifications: settings.notifications.toObject(),
  aiPrefs: settings.aiPreferences.toObject(),
  hiring: settings.hiringPreferences.toObject(),
  privacy: {
    ...settings.privacy.toObject(),
    twoFactorAuth: settings.privacy.twoFactorEnabled,
  },
});

const findRecruiter = async (req, res) => {
  const id = getUserId(req);

  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(401).json({ message: "Invalid authenticated user" });
    return null;
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }
  if (user.role !== "recruiter") {
    res.status(403).json({ message: "Recruiter access required" });
    return null;
  }
  if (user.isActive === false) {
    res.status(403).json({ message: "Account is deactivated" });
    return null;
  }

  return user;
};

export const getRecruiterSettings = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const settings = await getOrCreateSettings(user);

    return res.status(200).json({
      success: true,
      settings: responseShape(user, settings),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load recruiter settings",
      error: error.message,
    });
  }
};

export const updateRecruiterAccount = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const {
      fullName,
      name,
      email,
      phone,
      jobTitle,
      companyName,
      companyEmail,
    } = req.body;

    const nextName = (fullName ?? name)?.trim();
    const nextEmail = email?.trim().toLowerCase();

    if (nextName !== undefined && !nextName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    if (nextEmail && nextEmail !== user.email) {
      const exists = await User.findOne({
        email: nextEmail,
        _id: { $ne: user._id },
      });
      if (exists) {
        return res.status(409).json({ message: "This email is already in use" });
      }
      user.email = nextEmail;
    }

    if (nextName !== undefined) user.name = nextName;
    if (phone !== undefined) user.phone = String(phone).trim();

    const settings = await getOrCreateSettings(user);

    if (jobTitle !== undefined) settings.account.jobTitle = String(jobTitle).trim();

    if (companyName !== undefined) {
      const value = String(companyName).trim();
      settings.account.companyName = value;
      settings.companyPreferences.companyName = value;
      user.profile = {
        ...(user.profile?.toObject?.() || user.profile || {}),
        companyName: value,
      };
    }

    if (companyEmail !== undefined) {
      settings.account.companyEmail = String(companyEmail).trim().toLowerCase();
    }

    await Promise.all([user.save(), settings.save()]);

    return res.status(200).json({
      success: true,
      message: "Account details updated",
      settings: responseShape(user, settings),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update account",
      error: error.message,
    });
  }
};

export const updateCompanyPreferences = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const settings = await getOrCreateSettings(user);
    const fields = [
      "companyName",
      "companyWebsite",
      "industry",
      "companySize",
      "recruiterDesignation",
      "defaultJobLocation",
      "defaultWorkMode",
      "defaultEmploymentType",
      "preferredExperienceRange",
      "preferredEducationLevel",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        settings.companyPreferences[field] = req.body[field];
      }
    }

    const skills = req.body.skills ?? req.body.preferredSkills;
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({ message: "skills must be an array" });
      }
      if (skills.length > 10) {
        return res.status(400).json({ message: "You can add up to 10 skills only" });
      }

      const unique = [
        ...new Map(
          skills
            .map((s) => String(s).trim())
            .filter(Boolean)
            .map((s) => [s.toLowerCase(), s])
        ).values(),
      ].slice(0, 10);

      settings.companyPreferences.preferredSkills = unique;
    }

    if (req.body.companyName !== undefined) {
      user.profile = {
        ...(user.profile?.toObject?.() || user.profile || {}),
        companyName: String(req.body.companyName).trim(),
      };
      settings.account.companyName = String(req.body.companyName).trim();
    }

    if (req.body.companyWebsite !== undefined) {
      user.profile = {
        ...(user.profile?.toObject?.() || user.profile || {}),
        companyWebsite: String(req.body.companyWebsite).trim(),
      };
    }

    if (req.body.defaultJobLocation !== undefined) {
      user.profile = {
        ...(user.profile?.toObject?.() || user.profile || {}),
        location: String(req.body.defaultJobLocation).trim(),
      };
    }

    if (skills !== undefined) {
      user.profile = {
        ...(user.profile?.toObject?.() || user.profile || {}),
        skills: settings.companyPreferences.preferredSkills,
      };
    }

    await Promise.all([user.save(), settings.save()]);

    return res.status(200).json({
      success: true,
      message: "Recruiter preferences updated",
      settings: responseShape(user, settings),
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update company preferences",
      error: error.message,
    });
  }
};

export const updateNotifications = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const settings = await getOrCreateSettings(user);
    const keys = [
      "newApplications",
      "applicationStatusUpdates",
      "interviewReminders",
      "emailNotifications",
      "newJobAlerts",
      "candidateMessages",
      "aiScreeningCompleted",
      "pushNotifications",
    ];

    keys.forEach((key) => {
      if (req.body[key] !== undefined) {
        settings.notifications[key] = Boolean(req.body[key]);
      }
    });

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Notification preferences updated",
      notifications: settings.notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update notifications",
      error: error.message,
    });
  }
};

export const updateAiPreferences = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const settings = await getOrCreateSettings(user);

    [
      "aiCandidateMatching",
      "autoRankCandidates",
      "aiResumeScreening",
      "autoHighlightSkills",
      "interviewQuestionSuggestions",
      "jobDescriptionSuggestions",
    ].forEach((key) => {
      if (req.body[key] !== undefined) {
        settings.aiPreferences[key] = Boolean(req.body[key]);
      }
    });

    ["minMatchingScore", "minAtsScore"].forEach((key) => {
      if (req.body[key] !== undefined) {
        const value = Number(req.body[key]);
        if (!Number.isFinite(value) || value < 0 || value > 100) {
          return res.status(400).json({ message: `${key} must be between 0 and 100` });
        }
        settings.aiPreferences[key] = value;
      }
    });

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "AI & recruitment preferences updated",
      aiPrefs: settings.aiPreferences,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update AI preferences",
      error: error.message,
    });
  }
};

export const updateHiringPreferences = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const settings = await getOrCreateSettings(user);

    [
      "automaticallyPublishJobs",
      "allowResumeDownload",
      "allowCandidateMessaging",
      "enableAiScreeningForNewJobs",
    ].forEach((key) => {
      if (req.body[key] !== undefined) {
        settings.hiringPreferences[key] = Boolean(req.body[key]);
      }
    });

    ["defaultJobVisibility", "defaultApplicationDeadline"].forEach((key) => {
      if (req.body[key] !== undefined) {
        settings.hiringPreferences[key] = req.body[key];
      }
    });

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Hiring preferences updated",
      hiring: settings.hiringPreferences,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update hiring preferences",
      error: error.message,
    });
  }
};

export const updatePrivacy = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const settings = await getOrCreateSettings(user);

    if (req.body.profileVisibility !== undefined) {
      settings.privacy.profileVisibility = req.body.profileVisibility;
    }
    if (req.body.whoCanViewCandidateData !== undefined) {
      settings.privacy.whoCanViewCandidateData = req.body.whoCanViewCandidateData;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Privacy settings updated",
      privacy: {
        ...settings.privacy.toObject(),
        twoFactorAuth: settings.privacy.twoFactorEnabled,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update privacy settings",
      error: error.message,
    });
  }
};

export const toggleTwoFactor = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    if (typeof req.body.enabled !== "boolean") {
      return res.status(400).json({ message: "enabled must be true or false" });
    }

    const settings = await getOrCreateSettings(user);
    settings.privacy.twoFactorEnabled = req.body.enabled;
    await settings.save();

    return res.status(200).json({
      success: true,
      message: `Two-factor authentication ${req.body.enabled ? "enabled" : "disabled"}`,
      twoFactorAuth: settings.privacy.twoFactorEnabled,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update two-factor authentication",
      error: error.message,
    });
  }
};

export const changeRecruiterPassword = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};

export const downloadMyData = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const settings = await getOrCreateSettings(user);
    const data = {
      exportedAt: new Date().toISOString(),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
      recruiterSettings: responseShape(user, settings),
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="recruiter-data.json"');
    return res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    return res.status(500).json({
      message: "Failed to download data",
      error: error.message,
    });
  }
};

export const exportRecruitmentData = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    const settings = await getOrCreateSettings(user);
    const data = {
      exportedAt: new Date().toISOString(),
      recruiter: {
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: settings.account?.companyName || "",
      },
      settings: responseShape(user, settings),
      note: "Add your existing Job/Application/Interview models here if you want their records included in this export.",
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="recruitment-data.json"'
    );
    return res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    return res.status(500).json({
      message: "Failed to export recruitment data",
      error: error.message,
    });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    user.isActive = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to deactivate account",
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await findRecruiter(req, res);
    if (!user) return;

    await RecruiterSettings.deleteOne({ userId: user._id });
    await User.deleteOne({ _id: user._id });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete account",
      error: error.message,
    });
  }
};
