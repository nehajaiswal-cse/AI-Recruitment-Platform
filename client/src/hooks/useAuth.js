import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  loginUser,
  registerUser,
  logoutUser,
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

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };
};

export default useAuth;