// src/test-utils.tsx
import React, { ReactElement, FC } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./app/store";
import { BrowserRouter } from "react-router-dom";

// Define a type for the props
interface WrapperProps {
  children: React.ReactNode;
}

// Create a wrapper component that includes Provider and BrowserRouter
const AllProviders: FC<WrapperProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

// Create a custom render function that uses the wrapper
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from RTL
export * from "@testing-library/react";

// Override the default render method
export { customRender as render };
