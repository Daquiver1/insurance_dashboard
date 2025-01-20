import React from "react";
import { render, screen, within } from "@testing-library/react";
import PolicyDistributionChart from "./PolicyDistributionChart";
import { Policy } from "../../types";

// Mock the recharts library since it uses complex DOM manipulation
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
    children,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Pie: ({ data, onMouseEnter, onMouseLeave }: any) => (
    <div data-testid="pie">
      {data.map((entry: any, index: number) => (
        <div
          key={entry.name}
          data-testid={`pie-sector-${entry.name}`}
          onMouseEnter={() => onMouseEnter(entry, index)}
          onMouseLeave={onMouseLeave}
        >
          {entry.value}
        </div>
      ))}
    </div>
  ),
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Sector: () => null,
}));

describe("PolicyDistributionChart", () => {
  const mockPolicies: Policy[] = [
    {
      id: 1,
      type: "Health",
      status: "active",
      details: "Family Health Plan",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      coverageDetails: "Full coverage for family of four",
      premiumAmount: 1000,
      documentUrl: "https://example.com/doc1",
    },
    {
      id: 2,
      type: "Health",
      status: "active",
      details: "Individual Health Plan",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      coverageDetails: "Basic coverage for individual",
      premiumAmount: 1200,
      documentUrl: "https://example.com/doc2",
    },
    {
      id: 3,
      type: "Auto",
      status: "active",
      details: "Car Insurance",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      coverageDetails: "Full coverage for sedan",
      premiumAmount: 800,
      documentUrl: "https://example.com/doc3",
    },
    {
      id: 4,
      type: "Home",
      status: "expired",
      details: "Home Insurance",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      coverageDetails: "Basic coverage for house",
      premiumAmount: 1500,
      documentUrl: "https://example.com/doc4",
    },
  ];

  it("renders without crashing", () => {
    render(<PolicyDistributionChart policies={mockPolicies} />);
    expect(screen.getByTestId("pie")).toBeInTheDocument();
  });

  it("displays correct summary cards for each policy type", () => {
    render(<PolicyDistributionChart policies={mockPolicies} />);

    // Get all summary cards
    const summaryCards = screen
      .getAllByRole("generic")
      .filter((element) => element.className === "bg-red-50 p-4 rounded-lg");

    // Health policies card (2 policies, 50%)
    const healthCard = summaryCards.find((card) =>
      within(card).queryByText("Health")
    );
    expect(within(healthCard!).getByText("Health")).toBeInTheDocument();
    expect(within(healthCard!).getByText("2")).toBeInTheDocument();
    expect(within(healthCard!).getByText("50.0% of total")).toBeInTheDocument();

    // Auto policies card (1 policy, 25%)
    const autoCard = summaryCards.find((card) =>
      within(card).queryByText("Auto")
    );
    expect(within(autoCard!).getByText("Auto")).toBeInTheDocument();
    expect(within(autoCard!).getByText("1")).toBeInTheDocument();
    expect(within(autoCard!).getByText("25.0% of total")).toBeInTheDocument();

    // Home policies card (1 policy, 25%)
    const homeCard = summaryCards.find((card) =>
      within(card).queryByText("Home")
    );
    expect(within(homeCard!).getByText("Home")).toBeInTheDocument();
    expect(within(homeCard!).getByText("1")).toBeInTheDocument();
    expect(within(homeCard!).getByText("25.0% of total")).toBeInTheDocument();
  });

  it("processes data correctly including both active and expired policies", () => {
    render(<PolicyDistributionChart policies={mockPolicies} />);

    // Check pie chart sectors
    const healthSector = screen.getByTestId("pie-sector-Health");
    expect(healthSector).toHaveTextContent("2");

    const autoSector = screen.getByTestId("pie-sector-Auto");
    expect(autoSector).toHaveTextContent("1");

    const homeSector = screen.getByTestId("pie-sector-Home");
    expect(homeSector).toHaveTextContent("1");
  });

  it("handles empty policy array", () => {
    render(<PolicyDistributionChart policies={[]} />);

    // Check summary cards specifically
    const summaryCards = screen
      .getAllByRole("generic")
      .filter((element) => element.className === "bg-red-50 p-4 rounded-lg");

    summaryCards.forEach((card) => {
      expect(within(card).getByText("0")).toBeInTheDocument();
    });

  });
});
