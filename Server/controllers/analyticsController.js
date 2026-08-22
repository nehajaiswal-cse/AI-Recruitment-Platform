// import Job from "../models/job.js";
// import Application from "../models/applications.js";

// export const getRecruiterAnalytics = async (req, res) => {
//   try {
//     const recruiterId = req.user.id;

//     // 1. Find all jobs created by this recruiter
//     const jobs = await Job.find({ recruiterId }).select("_id");

//     const jobIds = jobs.map((job) => job._id);

//     // 2. Find applications for those jobs
//     const applications = await Application.find({
//       jobId: { $in: jobIds },
//     }).select("status");

//     // 3. Calculate analytics
//     const totalJobs = jobs.length;
//     const totalApplications = applications.length;

//     const shortlisted = applications.filter(
//       (application) => application.status === "shortlisted"
//     ).length;

//     const hired = applications.filter(
//       (application) => application.status === "hired"
//     ).length;

//     const rejected = applications.filter(
//       (application) => application.status === "rejected"
//     ).length;

//     res.status(200).json({
//       success: true,
//       data: {
//         totalJobs,
//         totalApplications,
//         shortlisted,
//         hired,
//         rejected,
//       },
//     });
//   } catch (error) {
//     console.error("Analytics error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch recruiter analytics",
//       error: error.message,
//     });
//   }
// };



import Job from "../models/job.js";
import Application from "../models/applications.js";

export const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // 1. Find all jobs created by this recruiter
    const jobs = await Job.find({ recruiterId }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // 2. Find applications for those jobs
    const applications = await Application.find({
      jobId: { $in: jobIds },
    }).select("status createdAt");

    // 3. Summary analytics
    const totalJobs = jobs.length;
    const totalApplications = applications.length;

    const shortlisted = applications.filter(
      (application) => application.status === "shortlisted"
    ).length;

    const hired = applications.filter(
      (application) => application.status === "hired"
    ).length;

    const rejected = applications.filter(
      (application) => application.status === "rejected"
    ).length;

    // 4. Application trend - last 6 months
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

      const monthName = date.toLocaleString("en-US", {
        month: "short",
      });

      const monthlyApplications = applications.filter((application) => {
        const createdAt = new Date(application.createdAt);

        return (
          createdAt.getFullYear() === year &&
          createdAt.getMonth() === month
        );
      });

      applicationTrend.push({
        month: monthName,

        applications: monthlyApplications.length,

        shortlisted: monthlyApplications.filter(
          (application) => application.status === "shortlisted"
        ).length,

        hired: monthlyApplications.filter(
          (application) => application.status === "hired"
        ).length,
      });
    }

    // 5. Response
    res.status(200).json({
      success: true,

      data: {
        totalJobs,
        totalApplications,
        shortlisted,
        hired,
        rejected,

        applicationTrend,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter analytics",
      error: error.message,
    });
  }
};