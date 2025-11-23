import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';

// Mock authentication service
const mockLogin = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Invalid credentials');
  }

  // Return mock user and token
  return {
    user: {
      id: 1,
      name: email.split('@')[0],
      email,
      username: email.split('@')[0],
    },
    token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
  };
};

const mockRegister = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock validation
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Return mock user and token
  return {
    user: {
      id: Math.floor(Math.random() * 1000),
      name,
      email,
      username: email.split('@')[0],
    },
    token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
  };
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // eslint-disable-next-line no-useless-catch
        try {
          const { user, token } = await mockLogin(email, password);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        // eslint-disable-next-line no-useless-catch
        try {
          const { user, token } = await mockRegister(name, email, password);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
