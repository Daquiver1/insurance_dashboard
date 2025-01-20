// src/app/slices/policiesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Policy } from "../../types";
import { RootState } from "../store";

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

export const selectPoliciesNearExpiry = (
  state: RootState,
  days: number = 30
): Policy[] => {
  const today = new Date();
  return state.policies.policies.filter((policy) => {
    const endDate = new Date(policy.endDate);
    const daysLeft = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft > 0 && daysLeft <= days;
  });
};

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
      const response = await api.get<Policy[]>(
        `/policies?id=${policyId}&userId=${auth.user.id}`
      );
      if (!response.data || response.data.length === 0) {
        return rejectWithValue("Policy not found");
      }
      const policy = response.data[0];
      return policy;
    } catch (error) {
      return rejectWithValue("Failed to fetch policy details");
    }
  }
);

const policiesSlice = createSlice({
  name: "policies",
  initialState,
  reducers: {
    clearCurrentPolicy(state) {
      state.currentPolicy = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
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
