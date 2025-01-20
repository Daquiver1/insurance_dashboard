// src/app/slices/authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import {
  AuthState,
  LoginCredentials,
  SignupFormInputs,
  User,
} from "../../types";
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
      const token = "temp";
      return { user, token };
    } else {
      return rejectWithValue("Invalid username or password");
    }
  } catch (error) {
    return rejectWithValue("An error occurred during login");
  }
});

export const signup = createAsyncThunk<
  User,
  Omit<SignupFormInputs, "confirmPassword">,
  { rejectValue: string }
>("auth/signup", async (data, { rejectWithValue }) => {
  try {
    const newUser: Omit<SignupFormInputs, "confirmPassword"> = {
      ...data,
    };
    const response = await api.post<User>("/users", newUser);
    return response.data;
  } catch (error) {
    return rejectWithValue("An error occurred during signup");
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
      //Signup
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to signup";
        state.isAuthenticated = false;
      })
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
