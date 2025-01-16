// src/app/slices/policiesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { RootState } from "../store";

export type PolicyType = "Health" | "Auto" | "Home";
export type PolicyStatus = "active" | "pending" | "expired";

export interface Policy {
  id: number;
  userId: number;
  type: PolicyType;
  status: PolicyStatus;
  details: string;
  startDate: string;
  endDate: string;
  coverageDetails: string;
  premiumAmount: number;
  documentUrl: string;
}

interface PoliciesState {
  policies: Policy[];
  currentPolicy: Policy | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PoliciesState = {
  policies: [],
  currentPolicy: null,
  status: "idle",
  error: null,
};

// Fetch policies for the authenticated user
export const fetchPolicies = createAsyncThunk<
  Policy[],
  void,
  { state: RootState; rejectValue: string }
>("policies/fetchPolicies", async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.user) {
    return rejectWithValue("User not authenticated");
  }

  try {
    const response = await api.get<Policy[]>(
      `/policies?userId=${auth.user.id}`
    );
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch policies");
  }
});

// Fetch a single policy by ID
export const fetchPolicyById = createAsyncThunk<
  Policy,
  number,
  { state: RootState; rejectValue: string }
>(
  "policies/fetchPolicyById",
  async (policyId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) {
      return rejectWithValue("User not authenticated");
    }

    try {
      const response = await api.get<Policy>(`/policies/${policyId}`);
      if (response.data.userId !== auth.user.id) {
        return rejectWithValue("Access denied");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch policy details");
    }
  }
);

const policiesSlice = createSlice({
  name: "policies",
  initialState,
  reducers: {
    // Define synchronous actions here if needed
    clearCurrentPolicy(state) {
      state.currentPolicy = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Policies
      .addCase(fetchPolicies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPolicies.fulfilled,
        (state, action: PayloadAction<Policy[]>) => {
          state.status = "succeeded";
          state.policies = action.payload;
        }
      )
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch policies";
      })
      // Fetch Policy by ID
      .addCase(fetchPolicyById.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.currentPolicy = null;
      })
      .addCase(
        fetchPolicyById.fulfilled,
        (state, action: PayloadAction<Policy>) => {
          state.status = "succeeded";
          state.currentPolicy = action.payload;
        }
      )
      .addCase(fetchPolicyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch policy details";
      });
  },
});

export const { clearCurrentPolicy } = policiesSlice.actions;

export const selectPolicies = (state: RootState) => state.policies;

export default policiesSlice.reducer;
