import api from "./api";

// ==========================================
// CREATE APPLICATION
// ==========================================

export const createApplication = async (formData) => {
  const response = await api.post(
    "/applications",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================================
// GET MY APPLICATIONS
// ==========================================

export const getMyApplications = async () => {
  const response = await api.get(
    "/applications/my"
  );

  return response.data;
};

// ==========================================
// GET SINGLE APPLICATION
// ==========================================

export const getApplicationById = async (
  applicationId
) => {
  const response = await api.get(
    `/applications/${applicationId}`
  );

  return response.data;
};

// ==========================================
// WITHDRAW APPLICATION
// ==========================================

export const withdrawApplication = async (
  applicationId
) => {
  const response = await api.delete(
    `/applications/${applicationId}`
  );

  return response.data;
};