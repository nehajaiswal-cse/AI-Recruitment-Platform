import axios from "axios";

const API_URL = "http://localhost:5000/api/analytics";

export const getRecruiterAnalytics = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/recruiter`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};