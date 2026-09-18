import api from "./api";

// GET /api/settings
export const getSettings = async () => {
  try {
    const response = await api.get("/settings");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch settings.",
      { cause: error }
    );
  }
};

// PUT /api/settings/account
export const updateAccount = async (data) => {
  try {
    const response = await api.put("/settings/account", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update account.",
      { cause: error }
    );
  }
};

// PUT /api/settings/job-preferences
export const updateJobPreferences = async (data) => {
  try {
    const response = await api.put("/settings/job-preferences", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update job preferences.",
      { cause: error }
    );
  }
};

// PUT /api/settings/notifications
export const updateNotifications = async (data) => {
  try {
    const response = await api.put("/settings/notifications", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update notifications.",
      { cause: error }
    );
  }
};

// PUT /api/settings/privacy
export const updatePrivacy = async (data) => {
  try {
    const response = await api.put("/settings/privacy", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update privacy settings.",
      { cause: error }
    );
  }
};

// PUT /api/settings/two-factor
export const toggleTwoFactor = async (enabled) => {
  try {
    const response = await api.put("/settings/two-factor", { enabled });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update two-factor authentication.",
      { cause: error }
    );
  }
};

// PUT /api/settings/change-password
export const changePassword = async (data) => {
  try {
    const response = await api.put("/settings/change-password", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to change password.",
      { cause: error }
    );
  }
};

// GET /api/settings/download-data
export const downloadMyData = async () => {
  try {
    const response = await api.get("/settings/download-data");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to download data.",
      { cause: error }
    );
  }
};

// PUT /api/settings/deactivate
export const deactivateAccount = async () => {
  try {
    const response = await api.put("/settings/deactivate");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to deactivate account.",
      { cause: error }
    );
  }
};

// PUT /api/settings/reactivate
export const reactivateAccount = async () => {
  try {
    const response = await api.put("/settings/reactivate");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reactivate account.",
      { cause: error }
    );
  }
};

// DELETE /api/settings
export const deleteAccount = async (password) => {
  try {
    const response = await api.delete("/settings", { data: { password } });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account.",
      { cause: error }
    );
  }
};