import api from "./api";

/* =====================================================
   GET RECRUITER INTERVIEWS
===================================================== */

export const getRecruiterInterviews = async () => {
  const response = await api.get("/interviews/recruiter");

  return response.data;
};

/* =====================================================
   CREATE INTERVIEW
===================================================== */

export const createInterview = async (interviewData) => {
  const response = await api.post(
    "/interviews",
    interviewData
  );

  return response.data;
};

/* =====================================================
   UPDATE / RESCHEDULE INTERVIEW
===================================================== */

export const updateInterview = async (
  interviewId,
  interviewData
) => {
  const response = await api.put(
    `/interviews/${interviewId}`,
    interviewData
  );

  return response.data;
};

/* =====================================================
   DELETE INTERVIEW
===================================================== */

export const deleteInterview = async (interviewId) => {
  const response = await api.delete(
    `/interviews/${interviewId}`
  );

  return response.data;
};

// =====================================================
// GET APPLICANT INTERVIEWS
// =====================================================

export const getMyInterviews = async () => {
  const response = await api.get("/interviews/my");

  return response.data;
};

// =====================================================
// GET SINGLE INTERVIEW
// =====================================================

export const getInterviewById = async (interviewId) => {
  const response = await api.get(
    `/interviews/${interviewId}`
  );
  console.log(response);
  return response.data;
};

// =====================================================
// CONFIRM INTERVIEW
// =====================================================

export const confirmInterview = async (interviewId) => {
  const response = await api.patch(
    `/interviews/${interviewId}/confirm`
  );

  return response.data;
};

// =====================================================
// CANCEL INTERVIEW
// =====================================================

export const cancelInterview = async (
  interviewId,
  reason = ""
) => {
  const response = await api.patch(
    `/interviews/${interviewId}/cancel`,
    {
      reason,
    }
  );

  return response.data;
};

// =====================================================
// RESCHEDULE INTERVIEW
// =====================================================

export const rescheduleInterview = async (
  interviewId,
  interviewData
) => {
  const response = await api.patch(
    `/interviews/${interviewId}/reschedule`,
    interviewData
  );

  return response.data;
};

// =====================================================
// GET INTERVIEW FEEDBACK
// =====================================================

export const getInterviewFeedback = async (
  interviewId
) => {
  const response = await api.get(
    `/interviews/${interviewId}/feedback`
  );

  return response.data;
};