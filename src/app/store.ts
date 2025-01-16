// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./slices/exampleSlice";
import authReducer from "./slices/authSlice";
import policiesReducer from "./slices/policiesSlice";
import claimsReducer from "./slices/claimsSlice";

const store = configureStore({
  reducer: {
    example: exampleReducer,
    auth: authReducer,
    policies: policiesReducer,
    claims: claimsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
