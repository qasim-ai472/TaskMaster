import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // Allow admins to access wrapped admin routes, redirect non-admins
  if ((user.role || "").toLowerCase() !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
