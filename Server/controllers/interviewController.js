import Interview from "../models/interview.js";
import Job from "../models/job.js";
import Candidate from "../models/candidate.js";
import transporter from "../config/mailer.js";

// =====================================================
// CREATE INTERVIEW
// =====================================================

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

    if (
      !candidate ||
      !job ||
      !date ||
      !time ||
      !type ||
      !interviewer
    ) {
      return res.status(400).json({
        message: "Required interview details are missing",
      });
    }

    console.log("SELECTED CANDIDATE ID:", candidate);

    const candidateData = await Candidate.findById(candidate).populate(
      "applicantId",
      "name email"
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

    console.log(
      "📧 Sending email to:",
      candidateUser.email
    );

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: candidateUser.email,
      subject: `Interview Scheduled - ${jobData.title} - ${date}`,
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

    return res.status(201).json({
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    console.error("Create interview error:", error);

    return res.status(500).json({
      message: "Failed to schedule interview",
      error: error.message,
    });
  }
};


// =====================================================
// GET MY INTERVIEWS - APPLICANT
// =====================================================

const getMyInterviews = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      applicantId: req.user.id,
    }).select("_id");

    const candidateIds = candidates.map(
      (candidate) => candidate._id
    );

    const interviews = await Interview.find({
      candidate: { $in: candidateIds },
    })
      .populate({
        path: "candidate",
        populate: {
          path: "applicantId",
          select: "name email",
        },
      })
      .populate(
        "job",
        "title company location employmentType"
      )
      .populate(
        "recruiter",
        "name email"
      )
      .sort({ date: 1 });

    return res.status(200).json({
      message: "Interviews fetched successfully",
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error(
      "Get my interviews error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch interviews",
      error: error.message,
    });
  }
};


// =====================================================
// GET INTERVIEW BY ID - APPLICANT
// =====================================================

const getInterviewById = async (req, res) => {
  try {
    console.log("PARAM ID:", req.params.id);
    console.log("USER ID:", req.user.id);

    const candidate = await Candidate.findOne({
      applicantId: req.user.id,
    }).select("_id");

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      candidate: candidate._id,
    })
      .populate({
        path: "candidate",
        populate: {
          path: "applicantId",
          select: "name email",
        },
      })
      .populate(
        "job",
        "title location employmentType"
      )
      .populate(
        "recruiter",
        "name email"
      );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      message: "Interview fetched successfully",
      interview,
    });
  } catch (error) {
    console.error(
      "Get interview error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch interview",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE / RESCHEDULE INTERVIEW
// =====================================================

const updateInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(
      interviewId
    );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    Object.assign(interview, req.body);

    await interview.save();

    const updatedInterview =
      await Interview.findById(interview._id)
        .populate({
          path: "candidate",
          populate: {
            path: "applicantId",
            select: "name email",
          },
        })
        .populate(
          "recruiter",
          "name email"
        )
        .populate(
          "job",
          "title"
        );

    const candidateUser =
      updatedInterview.candidate?.applicantId;

    if (candidateUser?.email) {
      console.log(
        "📧 Sending reschedule email to:",
        candidateUser.email
      );

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: candidateUser.email,
        subject: `Interview Rescheduled - ${
          updatedInterview.job?.title ||
          "Interview"
        } - ${updatedInterview.date}`,
        text: `
Hello ${candidateUser.name},

Your interview has been rescheduled.

Job: ${
  updatedInterview.job?.title || "N/A"
}
Date: ${updatedInterview.date}
Time: ${updatedInterview.time}
Interview Type: ${updatedInterview.type}
Interviewer: ${updatedInterview.interviewer}
${
  updatedInterview.meetingLink
    ? `Meeting Link: ${updatedInterview.meetingLink}`
    : ""
}

Please be available at the updated scheduled time.

Best regards,
AI Recruitment Platform
        `,
      });

      console.log(
        "✅ Reschedule email sent:",
        info.messageId
      );
    }

    return res.status(200).json({
      message:
        "Interview rescheduled successfully",
      interview: updatedInterview,
    });
  } catch (error) {
    console.error(
      "Update interview error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to reschedule interview",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE INTERVIEW STATUS
// =====================================================

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
    })
      .populate({
        path: "candidate",
        populate: {
          path: "applicantId",
          select: "name email",
        },
      })
      .populate("job", "title");

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found or you are not authorized",
      });
    }

    // Update status
    interview.status = status;

    await interview.save();

    // Send cancellation email
    if (
      status === "Cancelled" &&
      interview.candidate?.applicantId?.email
    ) {
      const candidateUser = interview.candidate.applicantId;

      console.log(
        "📧 Sending cancellation email to:",
        candidateUser.email
      );

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: candidateUser.email,
        subject: `Interview Cancelled - ${interview.job?.title || "Interview"}`,
        text: `
Hello ${candidateUser.name},

Your scheduled interview has been cancelled.

Job: ${interview.job?.title || "N/A"}
Date: ${interview.date}
Time: ${interview.time}
Interview Type: ${interview.type}
Interviewer: ${interview.interviewer}

Please contact the recruiter if you have any questions.

Best regards,
AI Recruitment Platform
        `,
      });

      console.log(
        "✅ Cancellation email sent:",
        info.messageId
      );
    }

    return res.status(200).json({
      message: "Interview status updated successfully",
      interview,
    });

  } catch (error) {
    console.error("Update interview status error:", error);

    return res.status(500).json({
      message: "Failed to update interview status",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE INTERVIEW
// =====================================================

const deleteInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const deletedInterview =
      await Interview.findByIdAndDelete(
        interviewId
      );

    if (!deletedInterview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      message:
        "Interview deleted successfully",
      interview: deletedInterview,
    });
  } catch (error) {
    console.error(
      "Delete interview error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete interview",
      error: error.message,
    });
  }
};


// =====================================================
// GET RECRUITER INTERVIEWS
// =====================================================

const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      recruiter: req.user.id,
    })
      .populate({
        path: "candidate",
        populate: {
          path: "applicantId",
          select: "name email phone",
        },
      })
      .populate(
        "job",
        "title location employmentType"
      )
      .sort({ date: 1 });

    return res.status(200).json({
      message:
        "Recruiter interviews fetched successfully",
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error(
      "Get recruiter interviews error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch recruiter interviews",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

export {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterview,
  updateInterviewStatus,
  getRecruiterInterviews,
  deleteInterview,
};