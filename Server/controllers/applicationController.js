import Application from "../models/applications.js";
import Job from "../models/job.js";

const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const existingApplication = await Application.findOne({
      jobId,
      applicantId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job"
      });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      resume: {
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`
      },
      coverLetter
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit application",
      error: error.message
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicantId: req.user.id
    }).populate("jobId", "title company location employmentType");

    res.status(200).json({
      message: "Applications fetched successfully",
      count: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message
    });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check that job belongs to logged-in recruiter
    const job = await Job.findOne({
      _id: jobId,
      recruiterId: req.user.id
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or you are not authorized"
      });
    }

    const applications = await Application.find({
      jobId: jobId
    }).populate(
      "applicantId",
      "name email phone profile"
    );

    res.status(200).json({
      message: "Job applications fetched successfully",
      count: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job applications",
      error: error.message
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "rejected",
      "hired"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status"
      });
    }

    const application = await Application.findById(
      req.params.id
    ).populate("jobId");

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    // Check that this job belongs to logged-in recruiter
    if (
      application.jobId.recruiterId.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this application"
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update application status",
      error: error.message
    });
  }
};

export { applyForJob, getMyApplications, getJobApplications , updateApplicationStatus};