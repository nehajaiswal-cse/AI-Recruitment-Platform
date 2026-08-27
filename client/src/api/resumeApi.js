import api from "./api";

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await api.post("/resumes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload resume error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to upload resume.",
      { cause: error }
    );
  }
};

export const getMyResumes = async () => {
  try {
    const response = await api.get("/resumes/my");
    return response.data;
  } catch (error) {
    console.error("Get resumes error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch resumes.",
      { cause: error }
    );
  }
};

export const getResumeUrl = async (id) => {
  try {
    const response = await api.get(`/resumes/${id}/url`);
    return response.data;
  } catch (error) {
    console.error("Get resume url error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to open resume.",
      { cause: error }
    );
  }
};

export const setDefaultResume = async (id) => {
  try {
    const response = await api.patch(`/resumes/${id}/default`);
    return response.data;
  } catch (error) {
    console.error("Set default resume error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to set default resume.",
      { cause: error }
    );
  }
};

export const deleteResume = async (id) => {
  try {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete resume error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete resume.",
      { cause: error }
    );
  }
};