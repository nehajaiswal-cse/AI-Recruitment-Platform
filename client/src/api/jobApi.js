import api from "./api";

// Get all jobs for applicant - Find Jobs
export const getAllJobs = async () => {
  const response = await api.get("/jobs");

  return response.data;
};

// Get all jobs created by logged-in recruiter
export const getMyJobs = async () => {
  const response = await api.get("/jobs/my-jobs");

  return response.data;
};

// Get single job
export const getJobById = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error("Job ID is required.");
    }

    const response = await api.get(`/jobs/${jobId}`);

    return response.data;
  } catch (err) {
    console.error("Get job by ID error:", err);

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Failed to fetch job.";

    throw new Error(message);
  }
};
// Create job
export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);

  return response.data;
};

// Update job
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(
    `/jobs/${jobId}`,
    jobData
  );

  return response.data;
};

// Delete job
export const deleteJob = async (jobId) => {
  const response = await api.delete(
    `/jobs/${jobId}`
  );

  return response.data;
};

// Update job status
export const updateJobStatus = async (
  jobId,
  status
) => {
  const response = await api.patch(
    `/jobs/${jobId}/status`,
    { status }
  );

  return response.data;
};

// Get applicants for a job
export const getJobApplicants = async (jobId) => {
  const response = await api.get(
    `/jobs/${jobId}/applicants`
  );

  return response.data;
};