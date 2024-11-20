import { useLocation, useNavigate } from "react-router-dom";

export default ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const redirectPath = useLocation().pathname.replace("/", "%2F");
  if (!user) {
    navigate(`/sign-in?redirect=${redirectPath}`, { replace: true });
  }
  return <>{children}</>;
};
