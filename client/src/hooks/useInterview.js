import { useEffect, useMemo } from "react";
import {
  useInterviewContext,
} from "./../context/InterviewContext";

const useInterview = () => {
  const {
    interviews,
    currentInterview,
    feedback,

    loading,
    error,

    fetchMyInterviews,
    fetchInterviewById,
    fetchInterviewFeedback,

    confirmInterview,
    cancelInterview,
    rescheduleInterview,

    clearError,
  } = useInterviewContext();

  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(() => {
    fetchMyInterviews();
  }, [fetchMyInterviews]);

  // ===================================================
  // UPCOMING
  // ===================================================

  const upcomingInterviews = useMemo(() => {
    const now = new Date();

    return interviews
      .filter((interview) => {
        const interviewDate = new Date(
          interview.date
        );

        return (
          interviewDate >= now &&
          interview.status !== "Completed" &&
          interview.status !== "Cancelled"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );
  }, [interviews]);

  // ===================================================
  // PAST
  // ===================================================

  const pastInterviews = useMemo(() => {
    const now = new Date();

    return interviews.filter((interview) => {
      const interviewDate = new Date(
        interview.date
      );

      return (
        interviewDate < now ||
        interview.status === "Completed" ||
        interview.status === "Cancelled"
      );
    });
  }, [interviews]);

  // ===================================================
  // STATS
  // ===================================================

  const upcomingCount =
    upcomingInterviews.length;

  const completedCount =
    interviews.filter(
      (interview) =>
        interview.status === "Completed"
    ).length;

  const confirmedCount =
    interviews.filter(
      (interview) =>
        interview.status === "Confirmed"
    ).length;

  // ===================================================
  // THIS WEEK
  // ===================================================

  const thisWeekCount = useMemo(() => {
    const now = new Date();

    const startOfWeek = new Date(now);

    startOfWeek.setDate(
      now.getDate() - now.getDay()
    );

    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(
      startOfWeek
    );

    endOfWeek.setDate(
      startOfWeek.getDate() + 7
    );

    return interviews.filter((interview) => {
      const date = new Date(
        interview.date
      );

      return (
        date >= startOfWeek &&
        date < endOfWeek
      );
    }).length;
  }, [interviews]);

  // ===================================================
  // NEXT INTERVIEW
  // ===================================================

  const nextInterview =
    upcomingInterviews[0] || null;

  return {
    interviews,
    currentInterview,
    feedback,

    loading,
    error,

    upcomingInterviews,
    pastInterviews,
    nextInterview,

    upcomingCount,
    completedCount,
    confirmedCount,
    thisWeekCount,

    fetchMyInterviews,
    fetchInterviewById,
    fetchInterviewFeedback,

    confirmInterview,
    cancelInterview,
    rescheduleInterview,

    clearError,
  };
};

export default useInterview;