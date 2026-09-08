import api from "./api";

// Fetch the current user's saved builder resume. Returns null if none exists.
export const getMyBuilderResume = async () => {
  try {
    const response = await api.get("/resume-builder/me");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) return null;

    console.error("Get builder resume error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to load resume.",
      { cause: error }
    );
  }
};

// Create a new builder resume. Returns the saved doc (should include _id).
export const createBuilderResume = async (payload) => {
  try {
    const response = await api.post("/resume-builder", payload);
    return response.data;
  } catch (error) {
    console.error("Create builder resume error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save resume.",
      { cause: error }
    );
  }
};

// Update an existing builder resume by id.
export const updateBuilderResume = async (id, payload) => {
  try {
    const response = await api.put(`/resume-builder/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update builder resume error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save resume.",
      { cause: error }
    );
  }
};

// Convenience: create if no id yet, otherwise update.
export const saveBuilderResume = async (id, payload) =>
  id ? updateBuilderResume(id, payload) : createBuilderResume(payload);

// Ask the backend to render + store a PDF (to S3) and return { url }.
export const exportBuilderResume = async (payload) => {
  try {
    const response = await api.post("/resume-builder/export", payload);
    return response.data;
  } catch (error) {
    console.error("Export builder resume error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to export resume.",
      { cause: error }
    );
  }
};