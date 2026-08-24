import api from "./api";

export const getRecruiterAnalytics = async () => {
  const response = await api.get("/analytics/recruiter");

  return response.data;
};
