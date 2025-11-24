import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Mock authentication service
const mockLogin = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Invalid credentials');
  }

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
): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  return { success: true };
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const { user, token } = await mockLogin(email, password);
    return { user, token };
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const result = await mockRegister(name, email, password);
    return result;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.fulfilled, () => {
        // Don't auto-login after registration
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
