import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleTheme as toggleThemeAction,
  setTheme as setThemeAction,
} from '@/store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  const toggleTheme = useCallback(() => {
    dispatch(toggleThemeAction());
  }, [dispatch]);

  const setTheme = useCallback(
    (theme: 'light' | 'dark') => {
      dispatch(setThemeAction(theme));
    },
    [dispatch]
  );

  return {
    mode,
    toggleTheme,
    setTheme,
  };
};
