import express from "express";
import { createJob, getJobs , getJobById, updateJob, deleteJob, getMyJobs} from "../controllers/jobControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/", authMiddleware, createJob);
router.get("/", getJobs);
router.get("/my-jobs", authMiddleware, getMyJobs);
router.get("/:id", getJobById);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);


export default router;