import express from "express";
import { createJob, getJobs , getJobById, updateJob, deleteJob, getMyJobs} from "../controllers/jobControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";


const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter"),
  createJob
);
router.get("/", getJobs);
router.get(
  "/my-jobs",
  authMiddleware,
  roleMiddleware("recruiter"),
  getMyJobs
);
router.get("/:id", getJobById);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateJob
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  deleteJob
);

export default router;