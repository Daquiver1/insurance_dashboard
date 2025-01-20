// src/app/slices/claimsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Claim, ClaimsState, ClaimStatus } from "../../types";
import { RootState } from "../store";

const initialState: ClaimsState = {
  claims: [],
  currentClaim: null,
  status: "idle",
  error: null,
};

export const submitClaim = createAsyncThunk<
  Claim,
  Omit<Claim, "id" | "status" | "submittedAt" | "history">,
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
      history: [
        {
          stage: "Submitted",
          date: new Date().toISOString(),
          remarks: "Claim submitted by user.",
        },
      ],
    };
    const response = await api.post<Claim>("/claims", newClaim);
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to submit claim");
  }
});

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

export const fetchClaimById = createAsyncThunk<
  Claim,
  number,
  { state: RootState; rejectValue: string }
>("claims/fetchClaimById", async (claimId, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.user) {
    return rejectWithValue("User not authenticated");
  }

  try {
    const response = await api.get<Claim>(`/claims/${claimId}`);
    if (response.data.userId !== auth.user.id) {
      return rejectWithValue("Access denied");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch claim details");
  }
});

const claimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    clearCurrentClaim(state) {
      state.currentClaim = null;
      state.error = null;
      state.status = "idle";
    },
    updateClaimStatus(
      state,
      action: PayloadAction<{
        claimId: number;
        newStatus: ClaimStatus;
        remarks: string;
      }>
    ) {
      const { claimId, newStatus, remarks } = action.payload;
      const claim = state.claims.find((c) => c.id === claimId);
      if (claim) {
        claim.status = newStatus;
        claim.history.push({
          stage: newStatus.replace("_", " ").toUpperCase(),
          date: new Date().toISOString(),
          remarks,
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchClaimById.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.currentClaim = null;
      })
      .addCase(
        fetchClaimById.fulfilled,
        (state, action: PayloadAction<Claim>) => {
          state.status = "succeeded";
          state.currentClaim = action.payload;
        }
      )
      .addCase(fetchClaimById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch claim details";
      });
  },
});

export const { clearCurrentClaim, updateClaimStatus } = claimsSlice.actions;

export const selectClaims = (state: RootState) => state.claims;

export default claimsSlice.reducer;
