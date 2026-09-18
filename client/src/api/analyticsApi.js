import api from "./api";

export const getRecruiterAnalytics = async () => {
  const response = await api.get("/analytics/recruiter");

  return response.data;
};

export const copilotApi = (applicationId, data) => {
  return api.post(
    `/copilot/candidate/${applicationId}`,
    data
  );
};