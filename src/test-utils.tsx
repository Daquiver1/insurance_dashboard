import { render, RenderOptions } from "@testing-library/react";
import React, { FC, ReactElement } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./app/store";
import { Policy, PolicyStatus } from "./types";

interface WrapperProps {
  children: React.ReactNode;
  initialState?: Record<string, any>;
}

const AllProviders: FC<WrapperProps> = ({ children, initialState }) => {
  const testStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });

  return (
    <Provider store={testStore}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  {
    initialState = {
      policies: {
        policies: [],
        currentPolicy: null,
        status: "idle",
        error: null,
      },
      claims: {
        claims: [],
        status: "idle",
        error: null,
      },
      auth: {
        user: { id: 1, name: "Test User" },
        status: "idle",
        error: null,
      },
    },
    ...renderOptions
  }: { initialState?: Record<string, any> } & Omit<RenderOptions, "wrapper"> = {}
) => {
  const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllProviders initialState={initialState}>{children}</AllProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";

export { customRender as render };

export const createMockPolicy = (overrides?: Partial<Policy>): Policy => ({
  id: 1,
  type: "Home",
  status: "active" as PolicyStatus,
  details: "Basic home insurance policy",
  premiumAmount: 1200,
  coverageDetails: "Covers fire and theft",
  documentUrl: "uploads/policy1/document1.pdf",
  startDate: "2024-01-01",
  endDate: "2025-01-01",
  ...overrides,
});