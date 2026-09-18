import api from "./api";

export const loginUser = async (formData) => {
  try {
    const response = await api.post("/auth/login", formData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.",
      { cause: error }
    );
  }
};

export const googleLoginUser = async ({ credential, role }) => {
  try {
    const response = await api.post("/auth/google", { credential, role });
    return response.data;
  } catch (error) {
    console.error("Google login error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Google sign-in failed. Please try again.",
      { cause: error }
    );
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await api.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.",
      { cause: error }
    );
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Logout failed. Please try again.",
      { cause: error }
    );
  }
};

export const forgotPassword = async ({ email, role }) => {
  try {
    const response = await api.post("/auth/forgot-password", { email, role });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Could not process request. Please try again.",
      { cause: error }
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Could not reset password. Please try again.",
      { cause: error }
    );
  }
};

export const getprofile = async () => {
  try {
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch profile.",
      { cause: error }
    );
  }
};



//     throw new Error(
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       "Registration failed. Please try again."
//     );
//   }
// }
// export const logoutUser = async () => {
//   try {
//     const response = await api.post("/auth/logout");
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       "Logout failed. Please try again."
//     );
//   }
// };
// export const getprofile = async () => {
//   try {
//     const response = await api.get("/profile");
//     return response.data;
//   } catch (error) {
//     console.error("Get profile error:", error);

//     throw new Error(
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       "Failed to fetch profile."
//     );
//   }
// };

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update profile."
    );
  }

}
