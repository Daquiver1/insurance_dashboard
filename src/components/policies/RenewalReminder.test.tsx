import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { createMockPolicy } from "../../test-utils";
import RenewalReminder from "./RenewalReminder";

// Mock the hooks
jest.mock("../../app/hooks", () => ({
  useAppSelector: jest.fn(),
}));

const renderRenewalReminder = () => {
  return render(
    <BrowserRouter>
      <RenewalReminder />
    </BrowserRouter>
  );
};

describe("RenewalReminder", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-06-15"));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("shows success message when no policies are near expiry", () => {
    (useAppSelector as jest.Mock).mockReturnValue([]);

    renderRenewalReminder();
    expect(screen.getByText("All policies are up to date")).toBeInTheDocument();
    expect(screen.getByText("All policies are up to date")).toHaveClass(
      "text-green-700"
    );
  });

  it("displays policies that need renewal", () => {
    const nearExpiryPolicies = [
      createMockPolicy({
        id: 1,
        type: "Home",
        endDate: "2024-07-01",
      }),
      createMockPolicy({
        id: 2,
        type: "Auto",
        endDate: "2024-07-15",
      }),
    ];

    (useAppSelector as jest.Mock).mockReturnValue(nearExpiryPolicies);

    renderRenewalReminder();

    expect(screen.getByText("Policies Requiring Renewal")).toBeInTheDocument();
    expect(screen.getByText("Home Policy #1")).toBeInTheDocument();
    expect(screen.getByText("Auto Policy #2")).toBeInTheDocument();
    expect(screen.getByText("Expires in 16 days")).toBeInTheDocument();
    expect(screen.getByText("Expires in 30 days")).toBeInTheDocument();
  });

  it("includes view details links for each policy", () => {
    const nearExpiryPolicies = [
      createMockPolicy({
        id: 1,
        type: "Home",
        endDate: "2024-07-01",
      }),
    ];

    (useAppSelector as jest.Mock).mockReturnValue(nearExpiryPolicies);

    renderRenewalReminder();

    const links = screen.getAllByText("View Details");
    expect(links).toHaveLength(1);
  });
});
