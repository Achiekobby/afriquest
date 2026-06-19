import { Navigate, Outlet } from "react-router";
import { getGuestLandingRoute } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

/**
 * Login and signup only — authenticated users are redirected away.
 */
export default function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getGuestLandingRoute(user?.role)} replace />;
  }

  return <Outlet />;
}
