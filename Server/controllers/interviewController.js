import Interview from "../models/interview.js";
import Job from "../models/job.js";
import User from "../models/user.js";
import Candidate from "../models/candidate.js";
import transporter from "../config/mailer.js";

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
      duration,
    } = req.body;

    if (!candidate || !job || !date || !time || !type || !interviewer) {
      return res.status(400).json({
        message: "Required interview details are missing",
      });
    }
    console.log("SELECTED CANDIDATE ID:", candidate);

    const candidateData = await Candidate.findById(candidate).populate(
      "applicantId",
      "name email",
    );

    console.log("CANDIDATE DATA:", candidateData);

    if (!candidateData) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    const candidateUser = candidateData.applicantId;

    if (!candidateUser) {
      return res.status(404).json({
        message: "Applicant user not found",
      });
    }

    if (!candidateUser) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    const jobData = await Job.findOne({
      _id: job,
      recruiterId: req.user.id,
    });

    if (!jobData) {
      return res.status(404).json({
        message: "Job not found or you are not authorized",
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
      duration,
    });

    console.log("📧 Sending email to:", candidateUser.email);

const info = await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: candidateUser.email,
  subject: "Interview Scheduled - AI Recruitment Platform",
  text: `
Hello ${candidateUser.name},

Your interview has been scheduled.

Job: ${jobData.title}
Date: ${date}
Time: ${time}
Interview Type: ${type}
Interviewer: ${interviewer}
${meetingLink ? `Meeting Link: ${meetingLink}` : ""}

Please be available at the scheduled time.

Best regards,
AI Recruitment Platform
  `
});

console.log("✅ Email sent:", info.messageId);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: candidateUser.email,
      subject: "Interview Scheduled - AI Recruitment Platform",
      text: `
Hello ${candidateUser.name},

Your interview has been scheduled.

Job: ${jobData.title}
Date: ${date}
Time: ${time}
Interview Type: ${type}
Interviewer: ${interviewer}
${meetingLink ? `Meeting Link: ${meetingLink}` : ""}

Please be available at the scheduled time.

Best regards,
AI Recruitment Platform
  `,
    });

    console.log("✅ Email sent:", info.messageId);
    
    res.status(201).json({
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to schedule interview",
      error: error.message,
    });
  }
};

const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      candidate: req.user.id,
    })
      .populate("job", "title company location employmentType")
      .populate("recruiter", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      message: "Interviews fetched successfully",
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interviews",
      error: error.message,
    });
  }
};

const getInterviewById = async (req, res) => {
  try {
    console.log("PARAM ID:", req.params.id);
    console.log("USER ID:", req.user.id);
    const interview = await Interview.findOne({
      _id: req.params.id,
      candidate: req.user.id,
    })
      .populate("job", "title location employmentType")
      .populate("recruiter", "name email");
    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      message: "Interview fetched successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interview",
      error: error.message,
    });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .populate("candidate", "name email")
      .populate("recruiter", "name email")
      .populate("job", "title");

    if (!updatedInterview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      message: "Interview updated successfully",
      interview: updatedInterview,
    });
  } catch (error) {
    console.error("Update interview error:", error);

    res.status(500).json({
      message: "Failed to update interview",
      error: error.message,
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
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid interview status",
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      recruiter: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found or you are not authorized",
      });
    }

    interview.status = status;

    await interview.save();

    res.status(200).json({
      message: "Interview status updated successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update interview status",
      error: error.message,
    });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const deletedInterview = await Interview.findByIdAndDelete(interviewId);

    if (!deletedInterview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      message: "Interview deleted successfully",
      interview: deletedInterview,
    });
  } catch (error) {
    console.error("Delete interview error:", error);

    return res.status(500).json({
      message: "Failed to delete interview",
      error: error.message,
    });
  }
};

const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      recruiter: req.user.id,
    })

      .populate("candidate", "name email phone")
      .populate("job", "title location employmentType")
      .sort({ date: 1 });

    res.status(200).json({
      message: "Recruiter interviews fetched successfully",
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recruiter interviews",
      error: error.message,
    });
  }
};

export {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterviewStatus,
  getRecruiterInterviews,
};
