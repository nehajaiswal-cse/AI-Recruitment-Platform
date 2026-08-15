import { Navigate, Outlet } from "react-router-dom";
import useAuth  from "../../hooks/useAuth";

const ProtectedRoute = ({ allowedRole }) => {
  const { user, loading } = useAuth();

  // Wait until authentication state is loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User is logged in but has the wrong role
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "recruiter") {
      return <Navigate to="/recruiter-dashboard" replace />;
    }

    if (user.role === "applicant") {
      return <Navigate to="/applicant-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  // Authorized
  return <Outlet />;
};

export default ProtectedRoute;