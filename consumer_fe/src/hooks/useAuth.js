import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  clearCredentials,
  selectIsAuthenticated,
  selectIsVerified,
  selectToken,
  selectUser,
  selectUserRole,
  setCredentials,
} from "../features/auth/authSlice";
import { ROUTES } from "../constants/routes";
import { getHomeRouteForRole, isOperatorRole, isTouristRole } from "../constants/roles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { persistor } from "../store";
import { clearLegacyAuth } from "../store/legacyAuthMigration";

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const role = useAppSelector(selectUserRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isVerified = useAppSelector(selectIsVerified);

  const login = useCallback(
    (nextToken, nextUser) => {
      dispatch(setCredentials({ token: nextToken, user: nextUser }));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    dispatch(clearCredentials());
    clearLegacyAuth();
    queryClient.clear();

    try {
      await persistor.flush();
    } catch {
      // Persist flush is best-effort; in-memory state is already cleared.
    }

    navigate(ROUTES.home, { replace: true });
  }, [dispatch, navigate, queryClient]);

  return {
    user,
    token,
    role,
    isAuthenticated,
    isVerified,
    isTourist: isTouristRole(role),
    isOperator: isOperatorRole(role),
    homeRoute: getHomeRouteForRole(role),
    login,
    logout,
  };
}
