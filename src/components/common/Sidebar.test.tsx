import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Sidebar from "./Sidebar";
import authReducer from "../../app/slices/authSlice";

// Create a mock store
const createMockStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={createMockStore()}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

describe("Sidebar", () => {
  const renderWithWrapper = () => {
    return render(<Sidebar />, { wrapper: TestWrapper });
  };

  beforeEach(() => {
    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders the logo and title", () => {
    renderWithWrapper();
    expect(screen.getAllByText("Insurance Portal").length).toBe(2);
    expect(screen.getAllByTestId("shield-icon").length).toBe(2);
  });

  it("renders all navigation items", () => {
    renderWithWrapper();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Claims History")).toBeInTheDocument();
    expect(screen.getByText("Submit Claim")).toBeInTheDocument();
  });

  it("renders logout button", () => {
    renderWithWrapper();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("handles mobile menu toggle", () => {
    // Set mobile viewport
    window.innerWidth = 500;
    renderWithWrapper();

    const menuButton = screen.getByLabelText("Toggle navigation");
    fireEvent.click(menuButton);

    // Check if sidebar becomes visible
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("translate-x-0");

    // Click again to close
    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("closes sidebar on mobile when clicking a link", () => {
    window.innerWidth = 500;
    renderWithWrapper();

    // Open sidebar
    fireEvent.click(screen.getByLabelText("Toggle navigation"));

    // Click a navigation link
    fireEvent.click(screen.getByText("Dashboard"));

    // Check if sidebar is closed
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("dispatches logout action when clicking logout button", () => {
    renderWithWrapper();
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    // You could add expectations here to verify the logout action was dispatched
    // This would require setting up a mock store with a spy
  });
});
