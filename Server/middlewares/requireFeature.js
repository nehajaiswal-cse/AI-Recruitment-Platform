const FEATURE_FREE_LIMIT = 5;

const FEATURE_USAGE_KEY = {
  ai_interview: "aiInterviewCount",
  ai_resume_optimization: "aiResumeOptimizationCount",
};

const requireFeature = (featureKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const usageKey = FEATURE_USAGE_KEY[featureKey];

    if (!usageKey) {
      return res.status(500).json({
        success: false,
        message: "Feature configuration error",
      });
    }

    // Pro users — unlimited access
    if (req.user.plan === "pro") {
      return next();
    }

    // Free users — check lifetime usage count
    const usedCount = req.user.freeUsage?.[usageKey] || 0;

    if (usedCount >= FEATURE_FREE_LIMIT) {
      return res.status(403).json({
        success: false,
        code: "PREMIUM_FEATURE_REQUIRED",
        message: `You've used all ${FEATURE_FREE_LIMIT} free tries. Upgrade to Pro for unlimited access.`,
        limit: FEATURE_FREE_LIMIT,
        used: usedCount,
      });
    }

    // Attach remaining count for controller/response use
    req.featureUsage = {
      usageKey,
      used: usedCount,
      remaining: FEATURE_FREE_LIMIT - usedCount,
      limit: FEATURE_FREE_LIMIT,
    };

    next();
  };
};

export default requireFeature;