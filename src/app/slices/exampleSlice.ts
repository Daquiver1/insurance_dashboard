// src/app/slices/exampleSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export interface ExampleItem {
  id: number;
  name: string;
}

interface ExampleState {
  data: ExampleItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExampleState = {
  data: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching data
export const fetchExampleData = createAsyncThunk(
  "example/fetchExampleData",
  async () => {
    const response = await api.get<ExampleItem[]>("/example");
    return response.data;
  }
);

const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    // Define synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExampleData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExampleData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchExampleData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default exampleSlice.reducer;
