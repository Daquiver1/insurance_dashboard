// src/app/slices/authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { AuthState, LoginCredentials, User } from "../../types";
import { RootState } from "../store";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: "idle",
  error: null,
};

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

export const logout = createAsyncThunk("auth/logout", async () => {
  return;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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
          state.isAuthenticated = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to login";
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
        state.isAuthenticated = false;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
