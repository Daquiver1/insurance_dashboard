/* eslint-disable testing-library/await-async-utils */
// PolicyDetails.test.tsx
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import api from "../api/api";
import * as policiesSlice from "../app/slices/policiesSlice";
import { createMockPolicy, render } from "../test-utils";
import PolicyDetails from "./PolicyDetails";

// Mock the modules
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: 1 }),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

jest.mock("../api/api"); // Ensure the api is mocked

describe("PolicyDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton when status is loading", () => {
    render(<PolicyDetails />, {
      initialState: {
        policies: {
          status: "loading",
          currentPolicy: null,
          error: null,
        },
        auth: {
          user: { id: 1 },
        },
      },
    });

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays policy details when data is loaded successfully", async () => {
    const mockPolicy = createMockPolicy({
      type: "Home",
      status: "active",
      premiumAmount: 1200,
      details: "Test policy details",
    });

    // Mock the API response for fetchPolicyById
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [mockPolicy],
    });

    render(<PolicyDetails />, {
      initialState: {
        policies: {
          status: "idle", // Start with 'idle' to trigger the fetch
          currentPolicy: null,
          error: null,
        },
        auth: {
          user: { id: 1 },
        },
      },
    });

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText("Policy Details")).toBeInTheDocument();
    });

    expect(screen.getByText(`Policy ID: ${mockPolicy.id}`)).toBeInTheDocument();
    expect(screen.getByText(mockPolicy.type)).toBeInTheDocument();
    expect(
      screen.getByText(`$${mockPolicy.premiumAmount.toLocaleString()}`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockPolicy.details)).toBeInTheDocument();
  });

  it("handles download button click correctly", async () => {
    const mockPolicy = createMockPolicy();
    const { saveAs } = require("file-saver");

    // Mock the API response for fetchPolicyById
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [mockPolicy],
    });

    render(<PolicyDetails />, {
      initialState: {
        policies: {
          status: "idle", // Start with 'idle' to trigger the fetch
          currentPolicy: null,
          error: null,
        },
        auth: {
          user: { id: 1 },
        },
      },
    });

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText("Policy Details")).toBeInTheDocument();
    });

    const downloadButton = screen.getByText("Download Policy Document");
    fireEvent.click(downloadButton);

    expect(saveAs).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      "Policy document downloaded successfully!"
    );
  });

  it("fetches policy data on mount", async () => {
    const mockPolicy = createMockPolicy();
    const fetchPolicyByIdSpy = jest.spyOn(policiesSlice, "fetchPolicyById");

    // Mock the API response for fetchPolicyById
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [mockPolicy],
    });

    render(<PolicyDetails />, {
      initialState: {
        policies: {
          status: "idle",
          currentPolicy: null,
          error: null,
        },
        auth: {
          user: { id: 1 },
        },
      },
    });

    await waitFor(() => {
      expect(fetchPolicyByIdSpy).toHaveBeenCalledWith(1);
    });
  });

  it("cleans up policy data on unmount", () => {
    const clearCurrentPolicySpy = jest.spyOn(
      policiesSlice,
      "clearCurrentPolicy"
    );
    const mockPolicy = createMockPolicy();

    // Mock the API response for fetchPolicyById
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [mockPolicy],
    });

    const { unmount } = render(<PolicyDetails />, {
      initialState: {
        policies: {
          status: "idle", // Start with 'idle' to trigger the fetch
          currentPolicy: null,
          error: null,
        },
        auth: {
          user: { id: 1 },
        },
      },
    });

    // Wait for the component to finish loading
    waitFor(() => {
      expect(screen.getByText("Policy Details")).toBeInTheDocument();
    });

    unmount();

    expect(clearCurrentPolicySpy).toHaveBeenCalled();
  });

  it("displays correct status color based on policy status", async () => {
    const mockPolicy = createMockPolicy({
      status: "active",
    });

    // Mock the API response for fetchPolicyById
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [mockPolicy],
    });

    render(<PolicyDetails />, {
      initialState: {
        policies: {
          status: "idle", // Start with 'idle' to trigger the fetch
          currentPolicy: null,
          error: null,
        },
        auth: {
          user: { id: 1 },
        },
      },
    });

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText("Policy Details")).toBeInTheDocument();
    });

    const statusElement = screen.getByText(mockPolicy.status);
    expect(statusElement).toHaveClass("bg-green-100");
    expect(statusElement).toHaveClass("text-green-800");
  });
});
