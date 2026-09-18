import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import recruiterOnly from "../middlewares/recruiterOnly.js";

import {
  getRecruiterSettings,
  updateRecruiterAccount,
  updateCompanyPreferences,
  updateNotifications,
  updateAiPreferences,
  updateHiringPreferences,
  updatePrivacy,
  toggleTwoFactor,
  changeRecruiterPassword,
  downloadMyData,
  exportRecruitmentData,
  deactivateAccount,
  deleteAccount,
} from "../controllers/recruiterSettingsController.js";

const router = express.Router();

router.use(authMiddleware, recruiterOnly);

router.get("/", getRecruiterSettings);

router.put("/account", updateRecruiterAccount);

router.put(
  "/company-preferences",
  updateCompanyPreferences
);

router.put(
  "/notifications",
  updateNotifications
);

router.put(
  "/ai-preferences",
  updateAiPreferences
);

router.put(
  "/hiring-preferences",
  updateHiringPreferences
);

router.put(
  "/privacy",
  updatePrivacy
);

router.put(
  "/two-factor",
  toggleTwoFactor
);

router.put(
  "/change-password",
  changeRecruiterPassword
);

router.get(
  "/download-data",
  downloadMyData
);

router.get(
  "/export-recruitment-data",
  exportRecruitmentData
);

router.post(
  "/deactivate",
  deactivateAccount
);

router.delete(
  "/account",
  deleteAccount
);

export default router;