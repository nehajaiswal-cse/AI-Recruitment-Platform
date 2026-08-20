import Candidate from "../models/Candidate.js";
import Application from "../models/applications.js";
import Job from "../models/job.js";

/*
|--------------------------------------------------------------------------
| CREATE CANDIDATE FROM APPLICATION
|--------------------------------------------------------------------------
*/

export const createManualCandidate = async (req, res) => {
  try {
    const {
      applicantId,
      jobId,
      skills,
      experience,
      recruiterNotes,
      status,
    } = req.body;

    // Validate required fields
    if (!applicantId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "Applicant ID and Job ID are required",
      });
    }

    // Logged-in recruiter
    const recruiterId = req.user._id;

    // Check job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure recruiter owns the job
    if (
      job.recruiterId.toString() !==
      recruiterId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to add candidate to this job",
      });
    }

    // Create candidate
    const candidate = await Candidate.create({
      applicationId: undefined,
      applicantId,
      jobId,
      recruiterId,

      skills: skills || [],

      experience:
        experience !== undefined
          ? experience
          : undefined,

      recruiterNotes:
        recruiterNotes || "",

      status: status || "applied",
    });

    const populatedCandidate =
      await Candidate.findById(candidate._id)
        .populate(
          "applicantId",
          "name email phone"
        )
        .populate(
          "jobId",
          "title company"
        )
        .populate(
          "recruiterId",
          "name email"
        );

    return res.status(201).json({
      success: true,
      message: "Candidate added successfully",
      candidate: populatedCandidate,
    });

  } catch (error) {
    console.error(
      "Create manual candidate error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add candidate",
      error: error.message,
    });
  }
};

export const createCandidate = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    // Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Prevent duplicate candidate
    const existingCandidate = await Candidate.findOne({
      applicationId
    });

    if (existingCandidate) {
      return res.status(409).json({
        success: false,
        message: "Candidate already exists for this application",
        candidate: existingCandidate
      });
    }

    // Find job
    const job = await Job.findById(application.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    /*
      Assuming logged-in recruiter is available as:
      req.user._id
    */

    const recruiterId = req.user._id;

    // Make sure recruiter owns this job
    if (job.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this application"
      });
    }

    const candidate = await Candidate.create({
      applicationId: application._id,
      applicantId: application.applicantId,
      jobId: application.jobId,
      recruiterId,

      // If application already contains extracted skills
      skills: application.skills || [],

      // If application contains experience
      experience: application.experience || undefined,

      status: "applied"
    });

    const populatedCandidate = await Candidate.findById(
      candidate._id
    )
      .populate("applicationId")
      .populate("applicantId", "name email")
      .populate("jobId", "title company")
      .populate("recruiterId", "name email");

    return res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      candidate: populatedCandidate
    });

  } catch (error) {
    console.error("Create candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create candidate",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET ALL CANDIDATES OF LOGGED-IN RECRUITER
|--------------------------------------------------------------------------
*/
export const getCandidates = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const candidates = await Candidate.find({
      recruiterId
    })
      .populate("applicantId", "name email phone")
      .populate("jobId", "title company")
      .populate("applicationId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: candidates.length,
      candidates
    });

  } catch (error) {
    console.error("Get candidates error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidates",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET SINGLE CANDIDATE
|--------------------------------------------------------------------------
*/
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findOne({
      _id: id,
      recruiterId: req.user._id
    })
      .populate("applicantId", "name email phone")
      .populate("jobId", "title company description")
      .populate("applicationId")
      .populate("recruiterId", "name email");

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    return res.status(200).json({
      success: true,
      candidate
    });

  } catch (error) {
    console.error("Get candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE CANDIDATE
|--------------------------------------------------------------------------
*/
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      recruiterNotes,
      aiScore,
      aiAnalysis,
      skills,
      experience
    } = req.body;

    const candidate = await Candidate.findOne({
      _id: id,
      recruiterId: req.user._id
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    if (status !== undefined) {
      candidate.status = status;
    }

    if (recruiterNotes !== undefined) {
      candidate.recruiterNotes = recruiterNotes;
    }

    if (aiScore !== undefined) {
      candidate.aiScore = aiScore;
    }

    if (aiAnalysis !== undefined) {
      candidate.aiAnalysis = aiAnalysis;
    }

    if (skills !== undefined) {
      candidate.skills = skills;
    }

    if (experience !== undefined) {
      candidate.experience = experience;
    }

    await candidate.save();

    const updatedCandidate = await Candidate.findById(candidate._id)
      .populate("applicantId", "name email phone")
      .populate("jobId", "title company")
      .populate("applicationId");

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      candidate: updatedCandidate
    });

  } catch (error) {
    console.error("Update candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update candidate",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE CANDIDATE STATUS
|--------------------------------------------------------------------------
*/
export const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "applied",
      "screening",
      "shortlisted",
      "interview",
      "selected",
      "offered",
      "hired",
      "rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate status"
      });
    }

    const candidate = await Candidate.findOne({
      _id: id,
      recruiterId: req.user._id
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    candidate.status = status;

    await candidate.save();

    return res.status(200).json({
      success: true,
      message: "Candidate status updated successfully",
      candidate
    });

  } catch (error) {
    console.error("Update candidate status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update candidate status",
      error: error.message
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE CANDIDATE
|--------------------------------------------------------------------------
*/
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findOne({
      _id: id,
      recruiterId: req.user._id
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    await Candidate.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Candidate deleted successfully"
    });

  } catch (error) {
    console.error("Delete candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete candidate",
      error: error.message
    });
  }
};