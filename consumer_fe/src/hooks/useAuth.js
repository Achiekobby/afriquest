import { useCallback } from "react";
import {
  clearCredentials,
  selectIsAuthenticated,
  selectToken,
  selectUser,
  setCredentials,
} from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
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
    isAuthenticated,
    login,
    logout,
  };
}
