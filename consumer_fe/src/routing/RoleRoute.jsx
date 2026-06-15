import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "../constants/routes";
import { getHomeRouteForRole } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={getHomeRouteForRole(user?.role)} replace />;
  }

  return <Outlet />;
}
