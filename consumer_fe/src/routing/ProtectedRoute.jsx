import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated, isVerified, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (user && isVerified === false) {
    return (
      <Navigate
        to={ROUTES.verify}
        replace
        state={{
          emailOrPhone: user.email || user.phone,
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}
