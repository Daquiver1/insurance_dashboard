import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { createMockPolicy } from "../../test-utils";
import PolicyItem from "./PolicyItem";

const renderPolicyItem = (policy = createMockPolicy()) => {
  return render(
    <BrowserRouter>
      <PolicyItem policy={policy} />
    </BrowserRouter>
  );
};

describe("PolicyItem", () => {
  beforeEach(() => {
    // Mock current date to ensure consistent days remaining calculations
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-06-15"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("displays policy information correctly", () => {
    const policy = createMockPolicy({
      type: "Home",
      details: "Test policy details",
      premiumAmount: 1500.5,
    });

    renderPolicyItem(policy);

    expect(screen.getByText("Home Policy")).toBeInTheDocument();
    expect(screen.getByText("Test policy details")).toBeInTheDocument();
    expect(screen.getByText("$1500.50")).toBeInTheDocument();
  });

  it("shows correct status badge styling for active policy", () => {
    renderPolicyItem(createMockPolicy({ status: "active" }));

    const statusBadge = screen.getByText("Active");
    expect(statusBadge).toHaveClass("text-emerald-700", "bg-emerald-50");
  });

  it("shows correct status badge styling for expired policy", () => {
    renderPolicyItem(createMockPolicy({ status: "expired" }));

    const statusBadge = screen.getByText("Expired");
    expect(statusBadge).toHaveClass("text-red-700", "bg-red-50");
  });

  it("displays days remaining for active policies", () => {
    const policy = createMockPolicy({
      status: "active",
      endDate: "2024-12-31",
    });

    renderPolicyItem(policy);
    expect(screen.getByText("199 days remaining")).toBeInTheDocument();
  });

  it("doesn't show days remaining for expired policies", () => {
    const policy = createMockPolicy({
      status: "expired",
      endDate: "2024-12-31",
    });

    renderPolicyItem(policy);
    expect(screen.queryByText(/days remaining/)).not.toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    renderPolicyItem(
      createMockPolicy({
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      })
    );

    expect(screen.getByText("Start: Jan 1, 2024")).toBeInTheDocument();
    expect(screen.getByText("End: Dec 31, 2024")).toBeInTheDocument();
  });
});
