import Interview from "../models/interview.js";
import Job from "../models/job.js";
import User from "../models/user.js";

const createInterview = async (req, res) => {
  try {
    const {
      candidate,
      job,
      date,
      time,
      type,
      interviewer,
      meetingLink,
      duration
    } = req.body;

    if (!candidate || !job || !date || !time || !type || !interviewer) {
      return res.status(400).json({
        message: "Required interview details are missing"
      });
    }

    const candidateUser = await User.findOne({
      _id: candidate,
      role: "applicant"
    });

    if (!candidateUser) {
      return res.status(404).json({
        message: "Applicant not found"
      });
    }

    const jobData = await Job.findOne({
      _id: job,
      recruiterId: req.user.id
    });

    if (!jobData) {
      return res.status(404).json({
        message: "Job not found or you are not authorized"
      });
    }

    const interview = await Interview.create({
      candidate,
      recruiter: req.user.id,
      job,
      date,
      time,
      type,
      interviewer,
      meetingLink,
      duration
    });

    res.status(201).json({
      message: "Interview scheduled successfully",
      interview
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to schedule interview",
      error: error.message
    });
  }
};


const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      candidate: req.user.id
    })
      .populate("job", "title company location employmentType")
      .populate("recruiter", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      message: "Interviews fetched successfully",
      count: interviews.length,
      interviews
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interviews",
      error: error.message
    });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      candidate: req.user.id
    })
      .populate("job", "title location employmentType")
      .populate("recruiter", "name email");

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    res.status(200).json({
      message: "Interview fetched successfully",
      interview
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interview",
      error: error.message
    });
  }
};

const updateInterviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Scheduled",
      "Confirmed",
      "Pending",
      "Completed",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid interview status"
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      recruiter: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found or you are not authorized"
      });
    }

    interview.status = status;

    await interview.save();

    res.status(200).json({
      message: "Interview status updated successfully",
      interview
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update interview status",
      error: error.message
    });
  }
};

const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      recruiter: req.user.id
    })
      .populate("candidate", "name email phone")
      .populate("job", "title location employmentType")
      .sort({ date: 1 });

    res.status(200).json({
      message: "Recruiter interviews fetched successfully",
      count: interviews.length,
      interviews
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recruiter interviews",
      error: error.message
    });
  }
};

export {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterviewStatus,
  getRecruiterInterviews
};