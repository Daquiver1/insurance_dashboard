// src/app/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { RootState } from "../store";

interface User {
  id: number;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null; // For simulation purposes
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

// Async thunk for logging in
export const login = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.get<User[]>(
      `/users?username=${credentials.username}&password=${credentials.password}`
    );
    if (response.data.length > 0) {
      const user = response.data[0];
      const token = "mock-token"; // In real apps, you'd get this from the server
      return { user, token };
    } else {
      return rejectWithValue("Invalid username or password");
    }
  } catch (error) {
    return rejectWithValue("An error occurred during login");
  }
});

// Async thunk for logging out (simulated)
export const logout = createAsyncThunk("auth/logout", async () => {
  // In a real app, you'd perform logout actions here
  return;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to login";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
