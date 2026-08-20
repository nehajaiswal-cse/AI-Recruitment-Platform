import {
  createContext,
  useCallback,
  useState,
} from "react";

import {
  getAllJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  getJobApplicants,
} from "../api/jobApi";

export const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
// GET ALL JOBS - FIND JOBS
// ==========================================

const fetchAllJobs = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getAllJobs();

    setJobs(data.jobs || data || []);

    return data;
  } catch (err) {
    console.error("Fetch all jobs error:", err);

    setError(
      err.response?.data?.message ||
        "Failed to fetch jobs."
    );

    throw err;
  } finally {
    setLoading(false);
  }
}, []);

  // ==========================================
  // GET MY JOBS
  // ==========================================

  const fetchMyJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs();

      setJobs(data.jobs || []);

      return data;
    } catch (err) {
      console.error("Fetch jobs error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch jobs."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // GET SINGLE JOB
  // ==========================================

 const fetchJobById = useCallback(async (jobId) => {
  try {
    setLoading(true);
    setError("");

    const data = await getJobById(jobId);

    setCurrentJob(data.job || data);

    return data;
  } catch (err) {
    console.error("Fetch job error:", err);

    const message =
      err.response?.data?.message ||
      "Failed to fetch job.";

    setError(message);

    throw err;
  } finally {
    setLoading(false);
  }
}, []);

  // ==========================================
  // CREATE JOB
  // ==========================================

  const addJob = useCallback(async (jobData) => {
    try {
      setLoading(true);
      setError("");

      const data = await createJob(jobData);

      const newJob = data.job || data;

      setJobs((previousJobs) => [
        newJob,
        ...previousJobs,
      ]);

      return data;
    } catch (err) {
      console.error("Create job error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create job."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // UPDATE JOB
  // ==========================================

  const editJob = useCallback(
    async (jobId, jobData) => {
      try {
        setLoading(true);
        setError("");

        const data = await updateJob(
          jobId,
          jobData
        );

        const updatedJob = data.job || data;

        setJobs((previousJobs) =>
          previousJobs.map((job) =>
            job._id === jobId
              ? {
                  ...job,
                  ...updatedJob,
                }
              : job
          )
        );

        setCurrentJob(updatedJob);

        return data;
      } catch (err) {
        console.error(
          "Update job error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to update job."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================
  // DELETE JOB
  // ==========================================

  const removeJob = useCallback(
    async (jobId) => {
      try {
        setLoading(true);
        setError("");

        const data = await deleteJob(jobId);

        setJobs((previousJobs) =>
          previousJobs.filter(
            (job) => job._id !== jobId
          )
        );

        setCurrentJob((previous) =>
          previous?._id === jobId
            ? null
            : previous
        );

        return data;
      } catch (err) {
        console.error(
          "Delete job error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to delete job."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const changeJobStatus = useCallback(
    async (jobId, status) => {
      try {
        setLoading(true);
        setError("");

        const data =
          await updateJobStatus(
            jobId,
            status
          );

        const updatedJob =
          data.job || data;

        setJobs((previousJobs) =>
          previousJobs.map((job) =>
            job._id === jobId
              ? {
                  ...job,
                  ...updatedJob,
                  status,
                }
              : job
          )
        );

        setCurrentJob((previous) => {
          if (!previous) return previous;

          if (previous._id !== jobId) {
            return previous;
          }

          return {
            ...previous,
            ...updatedJob,
            status,
          };
        });

        return data;
      } catch (err) {
        console.error(
          "Update job status error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to update job status."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================
  // GET APPLICANTS
  // ==========================================

  const fetchJobApplicants = useCallback(
    async (jobId) => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getJobApplicants(jobId);

        setApplicants(
          data.applicants || []
        );

        return data;
      } catch (err) {
        console.error(
          "Fetch applicants error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to fetch applicants."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearJobError = useCallback(() => {
    setError("");
  }, []);

  return (
    <JobContext.Provider
      value={{
        jobs,
        currentJob,
        applicants,

        loading,
        error,
    
        fetchAllJobs,
        fetchMyJobs,
        fetchJobById,

        addJob,
        editJob,
        removeJob,

        changeJobStatus,

        fetchJobApplicants,

        clearJobError,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};