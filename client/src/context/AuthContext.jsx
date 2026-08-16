import { createContext, useEffect, useState } from "react";
import { getprofile } from "../api/authApi";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // No token = no need to call /profile
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getprofile();

        setUser(data.user || data.data?.user || null);
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isAuthenticated = Boolean(user);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;