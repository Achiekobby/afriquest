import { useCallback } from "react";
import {
  clearCredentials,
  selectIsAuthenticated,
  selectToken,
  selectUser,
  selectUserRole,
  setCredentials,
} from "../features/auth/authSlice";
import { getHomeRouteForRole, isOperatorRole, isTouristRole } from "../constants/roles";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const role = useAppSelector(selectUserRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const login = useCallback(
    (nextToken, nextUser) => {
      dispatch(setCredentials({ token: nextToken, user: nextUser }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(clearCredentials());
  }, [dispatch]);

  return {
    user,
    token,
    role,
    isAuthenticated,
    isTourist: isTouristRole(role),
    isOperator: isOperatorRole(role),
    homeRoute: getHomeRouteForRole(role),
    login,
    logout,
  };
}
