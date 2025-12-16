import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializing, user, token } = useAuth();
  console.log({isAuthenticated, initializing, user, token})
  const location = useLocation();

  console.log('ProtectedRoute', { initializing, isAuthenticated, user, token });

  if (initializing) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;