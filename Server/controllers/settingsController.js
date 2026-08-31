import bcrypt from "bcryptjs";
import User from "../models/user.js";


export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// PUT /api/settings/account
// Account tab: full name, email, phone
export const updateAccount = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });

      if (emailExists) {
        return res.status(409).json({ message: "This email is already in use" });
      }

      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    return res.status(200).json({
      message: "Account details updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// PUT /api/settings/job-preferences
// Job preferences tab: role, location, work mode, salary, experience,
// employment type + skills array (skills profile.skills me stored hai)
export const updateJobPreferences = async (req, res) => {
  try {
    const {
      preferredRole,
      preferredLocation,
      workMode,
      expectedSalary,
      experienceLevel,
      employmentType,
      skills,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.jobPreferences = {
      preferredRole: preferredRole ?? user.jobPreferences?.preferredRole,
      preferredLocation: preferredLocation ?? user.jobPreferences?.preferredLocation,
      workMode: workMode ?? user.jobPreferences?.workMode,
      expectedSalary: expectedSalary ?? user.jobPreferences?.expectedSalary,
      experienceLevel: experienceLevel ?? user.jobPreferences?.experienceLevel,
      employmentType: employmentType ?? user.jobPreferences?.employmentType,
    };

    if (Array.isArray(skills)) {
      if (skills.length > 10) {
        return res.status(400).json({ message: "You can add up to 10 skills only" });
      }

      user.profile = { ...user.profile, skills };
    }

    await user.save();

    return res.status(200).json({
      message: "Job preferences updated",
      jobPreferences: user.jobPreferences,
      skills: user.profile?.skills || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// PUT /api/settings/notifications
export const updateNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notifications = {
      ...user.notifications.toObject(),
      ...req.body, 
    };

    await user.save();

    return res.status(200).json({
      message: "Notification preferences updated",
      notifications: user.notifications,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// PUT /api/settings/privacy
// Profile/resume visibility dropdowns
export const updatePrivacy = async (req, res) => {
  try {
    const { profileVisibility, resumeVisibility } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (profileVisibility) user.privacy.profileVisibility = profileVisibility;
    if (resumeVisibility) user.privacy.resumeVisibility = resumeVisibility;

    await user.save();

    return res.status(200).json({
      message: "Privacy settings updated",
      privacy: user.privacy,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// PUT /api/settings/two-factor
// Toggle switch — body me { enabled: true/false } bhejna
export const toggleTwoFactor = async (req, res) => {
  try {
    const { enabled } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.privacy.twoFactorEnabled = !!enabled;
    await user.save();

    return res.status(200).json({
      message: `Two-factor authentication ${enabled ? "enabled" : "disabled"}`,
      twoFactorEnabled: user.privacy.twoFactorEnabled,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// PUT /api/settings/change-password
// body: { currentPassword, newPassword }
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const downloadMyData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      user,
    };

    res.setHeader("Content-Disposition", "attachment; filename=my-data.json");
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json(exportData);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// PUT /api/settings/deactivate
// Profile temporarily hide karna — delete nahi karta
export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({ message: "Account deactivated" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

 
export const reactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json({ message: "Account reactivated" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required to delete your account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    
    await user.deleteOne();

    return res.status(200).json({ message: "Account deleted permanently" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};