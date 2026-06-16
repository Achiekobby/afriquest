import { Navigate, Outlet } from "react-router";
import { resolvePostAuthRedirect } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

/**
 * Login and signup only — authenticated users are redirected to their role home.
 */
export default function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={resolvePostAuthRedirect(null, user?.role)} replace />;
  }

  return <Outlet />;
}
