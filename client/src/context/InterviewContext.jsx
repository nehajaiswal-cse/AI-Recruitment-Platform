import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  // ================= APPLICANT =================
  getMyInterviews,
  getInterviewById,
  getInterviewFeedback,
  confirmInterview,
  cancelInterview,
  rescheduleInterview,

  // ================= RECRUITER =================
  getRecruiterInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
} from "../api/interviewApi";

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [interviews, setInterviews] = useState([]);
  const [currentInterview, setCurrentInterview] =
    useState(null);
  const [feedback, setFeedback] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===================================================
  // APPLICANT
  // GET MY INTERVIEWS
  // ===================================================

  const fetchMyInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyInterviews();
      console.log("🔥 MY INTERVIEWS API RESPONSE:", response);
console.log(
  "🔥 INTERVIEWS FROM DB:",
  response.interviews
);

      setInterviews(response.interviews || []);

      return response.interviews || [];
    } catch (error) {
      console.error(
        "Fetch applicant interviews error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch interviews";

      setError(message);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // RECRUITER
  // GET RECRUITER INTERVIEWS
  // ===================================================

  const fetchRecruiterInterviews = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getRecruiterInterviews();

        setInterviews(response.interviews || []);

        return response.interviews || [];
      } catch (error) {
        console.error(
          "Fetch recruiter interviews error:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch recruiter interviews";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===================================================
  // GET SINGLE INTERVIEW
  // COMMON
  // ===================================================

  const fetchInterviewById = useCallback(
    async (interviewId) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getInterviewById(interviewId);

        setCurrentInterview(
          response.interview
        );

        return response.interview;
      } catch (error) {
        console.error(
          "Fetch interview error:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch interview";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===================================================
  // GET FEEDBACK
  // APPLICANT / COMMON
  // ===================================================

  const fetchInterviewFeedback = useCallback(
    async (interviewId) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getInterviewFeedback(
            interviewId
          );

        setFeedback(response.feedback);

        return response.feedback;
      } catch (error) {
        console.error(
          "Fetch feedback error:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch feedback";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===================================================
  // APPLICANT
  // CONFIRM INTERVIEW
  // ===================================================

  const handleConfirmInterview = useCallback(
    async (interviewId) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await confirmInterview(interviewId);

        const updatedInterview =
          response.interview;

        setInterviews((prev) =>
          prev.map((interview) =>
            interview._id === interviewId
              ? updatedInterview
              : interview
          )
        );

        setCurrentInterview(
          updatedInterview
        );

        return updatedInterview;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to confirm interview";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===================================================
  // APPLICANT
  // CANCEL INTERVIEW
  // ===================================================

  const handleCancelInterview = useCallback(
    async (interviewId, reason = "") => {
      try {
        setLoading(true);
        setError("");

        const response =
          await cancelInterview(
            interviewId,
            reason
          );

        const updatedInterview =
          response.interview;

        setInterviews((prev) =>
          prev.map((interview) =>
            interview._id === interviewId
              ? updatedInterview
              : interview
          )
        );

        setCurrentInterview(
          updatedInterview
        );

        return updatedInterview;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel interview";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===================================================
  // APPLICANT
  // RESCHEDULE INTERVIEW
  // ===================================================

  const handleRescheduleInterview = useCallback(
    async (
      interviewId,
      interviewData
    ) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await rescheduleInterview(
            interviewId,
            interviewData
          );

        const updatedInterview =
          response.interview;

        setInterviews((prev) =>
          prev.map((interview) =>
            interview._id === interviewId
              ? updatedInterview
              : interview
          )
        );

        setCurrentInterview(
          updatedInterview
        );

        return updatedInterview;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to reschedule interview";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===================================================
  // RECRUITER
  // SCHEDULE INTERVIEW
  // ===================================================

  const handleCreateInterview = useCallback(
    async (interviewData) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await createInterview(
            interviewData
          );

        const newInterview =
          response.interview;

        setInterviews((prev) => [
          ...prev,
          newInterview,
        ]);

        return newInterview;
      } catch (error) {
        console.error(
          "Create interview error:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to schedule interview";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ===================================================
  // RECRUITER
  // RESCHEDULE INTERVIEW
  // ===================================================

  const handleRecruiterRescheduleInterview =
    useCallback(
      async (
        interviewId,
        interviewData
      ) => {
        try {
          setLoading(true);
          setError("");

          const response =
            await updateInterview(
              interviewId,
              interviewData
            );

          const updatedInterview =
            response.interview;

          setInterviews((prev) =>
            prev.map((interview) =>
              interview._id === interviewId
                ? updatedInterview
                : interview
            )
          );

          setCurrentInterview(
            updatedInterview
          );

          return updatedInterview;
        } catch (error) {
          console.error(
            "Recruiter reschedule error:",
            error
          );

          const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to reschedule interview";

          setError(message);

          throw error;
        } finally {
          setLoading(false);
        }
      },
      []
    );

  // ===================================================
  // RECRUITER
  // DELETE INTERVIEW
  // ===================================================

  const handleDeleteInterview = useCallback(
    async (interviewId) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await deleteInterview(interviewId);

        setInterviews((prev) =>
          prev.filter(
            (interview) =>
              interview._id !== interviewId
          )
        );

        if (
          currentInterview?._id ===
          interviewId
        ) {
          setCurrentInterview(null);
        }

        return response;
      } catch (error) {
        console.error(
          "Delete interview error:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete interview";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentInterview]
  );

  // ===================================================
  // CLEAR ERROR
  // ===================================================

  const clearError = () => {
    setError("");
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <InterviewContext.Provider
      value={{
        // =========================
        // STATE
        // =========================

        interviews,
        currentInterview,
        feedback,

        loading,
        error,

        // =========================
        // APPLICANT
        // =========================

        fetchMyInterviews,

        fetchInterviewById,

        fetchInterviewFeedback,

        confirmInterview:
          handleConfirmInterview,

        cancelInterview:
          handleCancelInterview,

        rescheduleInterview:
          handleRescheduleInterview,

        // =========================
        // RECRUITER
        // =========================

        fetchRecruiterInterviews,

        createInterview:
          handleCreateInterview,

        recruiterRescheduleInterview:
          handleRecruiterRescheduleInterview,

        deleteInterview:
          handleDeleteInterview,

        // =========================
        // COMMON
        // =========================

        clearError,

        setCurrentInterview,

        setFeedback,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

// =====================================================
// CUSTOM CONTEXT HOOK
// =====================================================

export const useInterviewContext = () => {
  const context =
    useContext(InterviewContext);

  if (!context) {
    throw new Error(
      "useInterviewContext must be used inside InterviewProvider"
    );
  }

  return context;
};