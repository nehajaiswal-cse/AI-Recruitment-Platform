import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  loginUser,
  registerUser,
  logoutUser,
   forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from "../api/authApi";

const useAuth = () => {
  const {
    user,
    setUser,
    loading,
    isAuthenticated,
  } = useContext(AuthContext);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
     
    const token =
      data.token ||
      data.data?.token;

    if (token) {
      localStorage.setItem("token", token);
    }

    const loggedInUser =
      data.user ||
      data.data?.user;

    setUser(loggedInUser);

    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    const token =
      data.token ||
      data.data?.token;

    if (token) {
      localStorage.setItem("token", token);
    }
    
    const registeredUser =
      data.user ||
      data.data?.user;

    if (registeredUser) {
      setUser(registeredUser);
    }

    return data;
  };

  // const logout = async () => {
  //   try {
  //     await logoutUser();
  //   } finally {
  //     setUser(null);
  //   }
  // };

  // return {
  //   user,
  //   loading,
  //   isAuthenticated,
  //   login,
  //   register,
  //   logout,
  // };

    const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const forgotPassword = async ({ email, role }) => {
    return await forgotPasswordApi({ email, role });
  };

  const resetPassword = async ({ token, password }) => {
    return await resetPasswordApi({ token, password });
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

};

export default useAuth;