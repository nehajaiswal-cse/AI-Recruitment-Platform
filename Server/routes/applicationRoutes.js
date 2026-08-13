import express from "express";
import { applyForJob , getMyApplications, getJobApplications, updateApplicationStatus} from "../controllers/applicationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("resume"),applyForJob);
router.get("/my", authMiddleware, getMyApplications);
router.get("/job/:jobId", authMiddleware, getJobApplications);
router.put("/:id",authMiddleware,updateApplicationStatus);

export default router;