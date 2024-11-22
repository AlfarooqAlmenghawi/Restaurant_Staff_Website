import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";

export const ProtectedRoute = ({ children }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const redirectPath = useLocation().pathname.replace("/", "%2F");
  if (!session) {
    return <Navigate to={`/sign-in?redirectPath=${redirectPath}`} />;
  }
  return <>{children}</>;
};
