import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Recruiter",
      user: req.user,
    });
  }
);

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      profile,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update common fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    // Update profile fields
    if (profile) {
      if (profile.skills !== undefined) {
        user.profile.skills = profile.skills;
      }

      if (profile.experience !== undefined) {
        user.profile.experience = profile.experience;
      }

      if (profile.education !== undefined) {
        user.profile.education = profile.education;
      }

      if (profile.location !== undefined) {
        user.profile.location = profile.location;
      }

      if (profile.companyName !== undefined) {
        user.profile.companyName = profile.companyName;
      }

      if (profile.companyWebsite !== undefined) {
        user.profile.companyWebsite = profile.companyWebsite;
      }

      if (profile.companyDescription !== undefined) {
        user.profile.companyDescription = profile.companyDescription;
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profile: updatedUser.profile,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
});


router.get(
  "/applicant",
  authMiddleware,
  roleMiddleware("applicant"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Applicant",
      user: req.user,
    });
  }
);
router.get(
  "/applicant-dashboard",
  authMiddleware,
  roleMiddleware("applicant"),
  (req, res) => {
    res.json({
      message: "Welcome Applicant!",
      user: req.user,
    });
  }
);

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});
export default router;