import express from "express";
import { askCandidateCopilot } from "../controllers/copilotController.js";

const router = express.Router();

router.post(
  "/candidate/:applicationId",
  askCandidateCopilot
);

export default router;