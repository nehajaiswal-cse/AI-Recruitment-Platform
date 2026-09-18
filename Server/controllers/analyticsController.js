import Job from "../models/job.js";
import Application from "../models/applications.js";
import Interview from "../models/interview.js";
import Candidate from "../models/candidate.js";

export const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // =====================================================
    // 1. FIND RECRUITER JOBS
    // =====================================================

    const jobs = await Job.find({ recruiterId }).select("_id title");

    const jobIds = jobs.map((job) => job._id);

    // =====================================================
    // 2. APPLICATIONS
    // =====================================================

    const applications = await Application.find({
      jobId: { $in: jobIds },
    }).select("jobId status createdAt");

    // =====================================================
    // 3. CANDIDATES
    // IMPORTANT:
    // Hiring pipeline is based on Candidate.status
    // =====================================================

    const candidates = await Candidate.find({
      recruiterId,
      jobId: { $in: jobIds },
    }).select("jobId status createdAt");

    // =====================================================
    // 4. INTERVIEWS
    // =====================================================

    const interviews = await Interview.find({
      recruiter: recruiterId,
    }).select("job candidate status date");

    // =====================================================
    // SUMMARY ANALYTICS
    // =====================================================

    const totalJobs = jobs.length;

    const totalApplications = applications.length;

    // Candidate statuses
    const applied = candidates.filter(
      (candidate) => candidate.status === "applied"
    ).length;

    const screened = candidates.filter(
      (candidate) => candidate.status !== "applied"
    ).length;

    const shortlisted = candidates.filter(
      (candidate) => candidate.status === "shortlisted"
    ).length;

    const interviewCandidates = candidates.filter(
      (candidate) =>
        candidate.status === "interview"
    ).length;

    const selected = candidates.filter(
      (candidate) => candidate.status === "selected"
    ).length;

    const offered = candidates.filter(
      (candidate) => candidate.status === "offered"
    ).length;

    const hired = candidates.filter(
      (candidate) => candidate.status === "hired"
    ).length;

    const rejected = candidates.filter(
      (candidate) => candidate.status === "rejected"
    ).length;

    const totalInterviews = interviews.length;

    const completedInterviews = interviews.filter(
      (interview) =>
        interview.status === "Completed"
    ).length;

    // =====================================================
    // APPLICATION TREND - LAST 6 MONTHS
    // =====================================================

    const applicationTrend = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthName = date.toLocaleString(
        "en-US",
        {
          month: "short",
        }
      );

      const monthlyApplications =
        applications.filter((application) => {
          const createdAt = new Date(
            application.createdAt
          );

          return (
            createdAt.getFullYear() === year &&
            createdAt.getMonth() === month
          );
        });

      const monthlyCandidates =
        candidates.filter((candidate) => {
          const createdAt = new Date(
            candidate.createdAt
          );

          return (
            createdAt.getFullYear() === year &&
            createdAt.getMonth() === month
          );
        });

      applicationTrend.push({
        month: monthName,

        applications:
          monthlyApplications.length,

        shortlisted:
          monthlyCandidates.filter(
            (candidate) =>
              candidate.status ===
              "shortlisted"
          ).length,

        hired:
          monthlyCandidates.filter(
            (candidate) =>
              candidate.status === "hired"
          ).length,
      });
    }

    // =====================================================
    // CANDIDATE PIPELINE
    // =====================================================

    const candidatePipeline = [
      {
        stage: "Applied",
        value: applied,
        fill: "#4f46e5",
      },

      {
        stage: "Screened",
        value: screened,
        fill: "#0891b2",
      },

      {
        stage: "Shortlisted",
        value: shortlisted,
        fill: "#d97706",
      },

      {
        stage: "Interviewed",
        value:
          interviewCandidates ||
          totalInterviews,
        fill: "#7c3aed",
      },

      {
        stage: "Hired",
        value: hired,
        fill: "#059669",
      },

      {
        stage: "Rejected",
        value: rejected,
        fill: "#dc2626",
      },
    ];

    // =====================================================
    // JOB PERFORMANCE
    // =====================================================

    const jobPerformance = jobs.map((job) => {
      const jobApplications =
        applications.filter(
          (application) =>
            application.jobId?.toString() ===
            job._id.toString()
        );

      const jobCandidates =
        candidates.filter(
          (candidate) =>
            candidate.jobId?.toString() ===
            job._id.toString()
        );

      const jobInterviews =
        interviews.filter(
          (interview) =>
            interview.job?.toString() ===
            job._id.toString()
        );

      return {
        job: job.title,

        applications:
          jobApplications.length,

        shortlist:
          jobCandidates.filter(
            (candidate) =>
              candidate.status ===
              "shortlisted"
          ).length,

        interview:
          jobInterviews.length,

        hired:
          jobCandidates.filter(
            (candidate) =>
              candidate.status === "hired"
          ).length,
      };
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    res.status(200).json({
      success: true,

      data: {
        totalJobs,

        totalApplications,

        // Candidate status counts
        applied,
        shortlisted,
        screened,
        interviewCandidates,
        selected,
        offered,
        hired,
        rejected,

        totalInterviews,
        completedInterviews,

        applicationTrend,

        candidatePipeline,

        jobPerformance,
      },
    });
  } catch (error) {
    console.error(
      "Analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch recruiter analytics",
      error: error.message,
    });
  }
};