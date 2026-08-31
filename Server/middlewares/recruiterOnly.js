import User from "../models/user.js";

const recruiterOnly = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id).select(
      "role isActive"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "recruiter") {
      return res.status(403).json({
        message: "Recruiter access required",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    req.currentUser = user;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Unable to verify recruiter access",
      error: error.message,
    });
  }
};

export default recruiterOnly;