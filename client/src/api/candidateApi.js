import api from "./api";

// Get all candidates of logged-in recruiter
export const getCandidates = async () => {
  const response = await api.get("/candidates");
  return response.data;
};

// Get single candidate
export const getCandidateById = async (candidateId) => {
  const response = await api.get(`/candidates/${candidateId}`);
  return response.data;
};




// Create candidate from application
export const createCandidate = async (applicationId) => {
  const response = await api.post("/candidates", {
    applicationId,
  });

  return response.data;
};

// Update candidate
export const updateCandidate = async (candidateId, candidateData) => {
  const response = await api.put(
    `/candidates/${candidateId}`,
    candidateData
  );

  return response.data;
};

// Update candidate status
export const updateCandidateStatus = async (candidateId, status) => {
  const response = await api.patch(
    `/candidates/${candidateId}/status`,
    { status }
  );

  return response.data;
};

// Delete candidate
export const deleteCandidate = async (candidateId) => {

  const response = await api.delete(
    `/candidates/${candidateId}`
  );

  return response.data;
};

export const analyzeCandidateResume = async (applicationId) => {
  try {
    console.log(
      "🤖 API received applicationId:",
      applicationId
    );

    if (!applicationId) {
      throw new Error("Application ID is missing");
    }

    const response = await api.post(
      "/ats/analyze",
      {
        applicationId,
      }
    );

    console.log(
      "🤖 AI API response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Analyze candidate resume API error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};