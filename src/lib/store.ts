import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';

export const useThemeStore = create<Theme>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
