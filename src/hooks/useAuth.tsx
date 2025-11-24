import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, registerUser, logout as logoutAction } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (email: string, password: string) => {
      await dispatch(loginUser({ email, password })).unwrap();
    },
    [dispatch]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await dispatch(registerUser({ name, email, password })).unwrap();
      return result;
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
