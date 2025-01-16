// src/app/slices/claimsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { RootState } from "../store";

export type ClaimStatus = "submitted" | "approved" | "rejected";

export interface Claim {
  id: number;
  userId: number;
  policyId: number;
  claimType: string;
  description: string;
  files: string[];
  status: ClaimStatus;
  submittedAt: string;
}

interface ClaimsState {
  claims: Claim[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ClaimsState = {
  claims: [],
  status: "idle",
  error: null,
};

// Submit a new claim
export const submitClaim = createAsyncThunk<
  Claim,
  Omit<Claim, "id" | "status" | "submittedAt">,
  { state: RootState; rejectValue: string }
>("claims/submitClaim", async (claimData, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.user) {
    return rejectWithValue("User not authenticated");
  }

  try {
    const newClaim: Omit<Claim, "id"> = {
      ...claimData,
      status: "submitted",
      submittedAt: new Date().toISOString(),
    };
    const response = await api.post<Claim>("/claims", newClaim);
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to submit claim");
  }
});

// Fetch claims for the authenticated user
export const fetchClaims = createAsyncThunk<
  Claim[],
  void,
  { state: RootState; rejectValue: string }
>("claims/fetchClaims", async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.user) {
    return rejectWithValue("User not authenticated");
  }

  try {
    const response = await api.get<Claim[]>(`/claims?userId=${auth.user.id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch claims");
  }
});

const claimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    // Define synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      // Submit Claim
      .addCase(submitClaim.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
        state.status = "succeeded";
        state.claims.push(action.payload);
      })
      .addCase(submitClaim.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to submit claim";
      })
      // Fetch Claims
      .addCase(fetchClaims.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchClaims.fulfilled,
        (state, action: PayloadAction<Claim[]>) => {
          state.status = "succeeded";
          state.claims = action.payload;
        }
      )
      .addCase(fetchClaims.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch claims";
      });
  },
});

export const selectClaims = (state: RootState) => state.claims;

export default claimsSlice.reducer;
