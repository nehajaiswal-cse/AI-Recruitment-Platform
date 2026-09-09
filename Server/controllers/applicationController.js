
import Application from "../models/applications.js";
import Job from "../models/job.js";
import Candidate from "../models/candidate.js";

import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";


// ======================================================
// APPLY FOR JOB
// ======================================================

const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // -----------------------------------------------
    // Authentication
    // -----------------------------------------------

    if (!req.user?.id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    // -----------------------------------------------
    // Validate Job ID
    // -----------------------------------------------

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // -----------------------------------------------
    // Validate Resume File
    // -----------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    // -----------------------------------------------
    // Find Job
    // -----------------------------------------------

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // -----------------------------------------------
    // Check Duplicate Application
    // -----------------------------------------------

    const existingApplication = await Application.findOne({
      jobId,
      applicantId: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // =================================================
    // AWS S3
    // =================================================

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,

      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // -----------------------------------------------
    // Create unique file name
    // -----------------------------------------------

    const fileName =
      `resumes/${Date.now()}-${req.file.originalname}`;

    // -----------------------------------------------
    // Upload Resume to S3
    // -----------------------------------------------

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,

      Key: fileName,

      Body: req.file.buffer,

      ContentType: req.file.mimetype,
    });

    await s3Client.send(uploadCommand);

    // -----------------------------------------------
    // S3 URL
    // -----------------------------------------------

    const fileUrl =
      `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;


    // =================================================
    // CREATE APPLICATION
    // =================================================

    const application = await Application.create({
      jobId,

      applicantId: req.user.id,

      resume: {
        fileName: req.file.originalname,
        fileUrl: fileUrl,
      },

      coverLetter,

      status: "applied",
    });


    // =================================================
    // CREATE CANDIDATE
    // =================================================

    const candidate = await Candidate.create({
      applicationId: application._id,

      applicantId: req.user.id,

      jobId: job._id,

      recruiterId: job.recruiterId,

      status: "applied",
    });


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      message: "Application submitted successfully",

      application,

      candidate,
    });

  } catch (error) {

    console.error("Apply job error:", error);

    return res.status(500).json({
      message: "Failed to submit application",

      error: error.message,
    });
  }
};


// ======================================================
// GET MY APPLICATIONS
// ======================================================

const getMyApplications = async (req, res) => {
  try {

    const applications = await Application.find({
      applicantId: req.user.id,
    })
      .populate(
        "jobId",
        "title company location employmentType"
      );

    return res.status(200).json({
      message: "Applications fetched successfully",

      count: applications.length,

      applications,
    });

  } catch (error) {

    console.error(
      "Get applications error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch applications",

      error: error.message,
    });
  }
};


// ======================================================
// GET JOB APPLICATIONS
// ======================================================

const getJobApplications = async (req, res) => {
  try {

    const { jobId } = req.params;

    // -----------------------------------------------
    // Check recruiter authorization
    // -----------------------------------------------

    const job = await Job.findOne({
      _id: jobId,

      recruiterId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message:
          "Job not found or you are not authorized",
      });
    }


    // -----------------------------------------------
    // Get applications
    // -----------------------------------------------

    const applications = await Application.find({
      jobId,
    })
      .populate(
        "applicantId",
        "name email phone profile"
      );


    return res.status(200).json({
      message:
        "Job applications fetched successfully",

      count: applications.length,

      applications,
    });

  } catch (error) {

    console.error(
      "Get job applications error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch job applications",

      error: error.message,
    });
  }
};


// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "rejected",
      "hired",
    ];

    // -----------------------------------------------
    // Validate status
    // -----------------------------------------------

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }


    // -----------------------------------------------
    // Find application
    // -----------------------------------------------

    const application =
      await Application.findById(req.params.id)
        .populate("jobId");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }


    // -----------------------------------------------
    // Recruiter authorization
    // -----------------------------------------------

    if (
      application.jobId.recruiterId.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to update this application",
      });
    }


    // -----------------------------------------------
    // Update status
    // -----------------------------------------------

    application.status = status;

    await application.save();


    return res.status(200).json({
      message:
        "Application status updated successfully",

      application,
    });

  } catch (error) {

    console.error(
      "Update application status error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update application status",

      error: error.message,
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

export {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
