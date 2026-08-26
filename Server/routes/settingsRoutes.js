import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getSettings,
  updateAccount,
  updateJobPreferences,
  updateNotifications,
  updatePrivacy,
  toggleTwoFactor,
  changePassword,
  downloadMyData,
  deactivateAccount,
  reactivateAccount,
  deleteAccount,
} from "../controllers/SettingsController.js";

const router = express.Router();

// Sab settings routes ke liye login zaroori hai
router.use(authMiddleware);

router.get("/", getSettings);

router.put("/account", updateAccount);
router.put("/job-preferences", updateJobPreferences);
router.put("/notifications", updateNotifications);
router.put("/privacy", updatePrivacy);
router.put("/two-factor", toggleTwoFactor);
router.put("/change-password", changePassword);

router.get("/download-data", downloadMyData);
router.put("/deactivate", deactivateAccount);
router.put("/reactivate", reactivateAccount);
router.delete("/", deleteAccount);

export default router;