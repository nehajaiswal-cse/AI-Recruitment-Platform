// Feature-access / entitlement gate.
// Usage: requireFeature("ai_interview")
// Must run AFTER authMiddleware (needs req.user).

const FEATURE_PLAN_MAP = {
  ai_interview: ["pro"],
  // future features can be added here, e.g.:
  // ai_resume_optimization: ["pro"],
};

const requireFeature = (featureKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const allowedPlans = FEATURE_PLAN_MAP[featureKey];

    if (!allowedPlans) {
      // Unknown feature key — fail safe, deny access
      return res.status(500).json({
        success: false,
        message: "Feature configuration error",
      });
    }

    const userPlan = req.user.plan || "free";

    if (!allowedPlans.includes(userPlan)) {
      return res.status(403).json({
        success: false,
        code: "PREMIUM_FEATURE_REQUIRED",
        message: "This feature requires a Pro subscription.",
      });
    }

    next();
  };
};

export default requireFeature;