import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";

export const ProtectedRoute = ({ children, requiresRestaurant }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const redirectPath = useLocation().pathname.replace("/", "%2F");
  if (!session) {
    return (
      <Navigate
        to={`/sign-in?redirectPath=${redirectPath}`}
        state={{ hasRedirected: true }}
      />
    );
  }

  if (requiresRestaurant && isNaN(session.restaurant_id)) {
    return (
      <Navigate
        to={`/my-restaurants?redirectPath=${redirectPath}`}
        state={{ hasRedirected: true }}
      />
    );
  }
  return <>{children}</>;
};
