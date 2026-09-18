import api from "./api";

export const startAiInterview = async ({ role, type }) => {
  const response = await api.post("/ai-interviews/start", { role, type });
  return response.data;
};

export const submitAiAnswer = async (interviewId, questionIndex, answer) => {
  const response = await api.post(`/ai-interviews/${interviewId}/answer`, {
    questionIndex,
    answer,
  });
  return response.data;
};

export const completeAiInterview = async (interviewId) => {
  const response = await api.post(`/ai-interviews/${interviewId}/complete`);
  return response.data;
};

export const getAiInterviewHistory = async () => {
  const response = await api.get("/ai-interviews/history");
  return response.data;
};

export const getAiInterviewById = async (interviewId) => {
  const response = await api.get(`/ai-interviews/${interviewId}`);
  return response.data;
};