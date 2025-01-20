import { render, screen, within } from "@testing-library/react";
import React from "react";
import { Policy } from "../../types";
import PremiumTrendsChart from "./PremiumTrendsChart";

// Mock the recharts library
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
    children,
  LineChart: ({ children, data }: any) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Line: ({ dataKey, name }: any) => (
    <div data-testid={`line-${dataKey}`} data-name={name} />
  ),
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe("PremiumTrendsChart", () => {
  const mockPolicies: Policy[] = [
    {
      id: 1,
      type: "Health",
      status: "active",
      details: "Health Plan A",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      coverageDetails: "Full coverage",
      premiumAmount: 1000,
      documentUrl: "https://example.com/doc1",
    },
    {
      id: 2,
      type: "Auto",
      status: "active",
      details: "Auto Plan A",
      startDate: "2024-01-20",
      endDate: "2024-12-31",
      coverageDetails: "Full coverage",
      premiumAmount: 800,
      documentUrl: "https://example.com/doc2",
    },
    {
      id: 3,
      type: "Health",
      status: "active",
      details: "Health Plan B",
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      coverageDetails: "Basic coverage",
      premiumAmount: 1200,
      documentUrl: "https://example.com/doc3",
    },
  ];

  it("renders without crashing", () => {
    render(<PremiumTrendsChart policies={mockPolicies} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("displays correct summary metrics", () => {
    render(<PremiumTrendsChart policies={mockPolicies} />);

    const summaryCards = screen
      .getAllByRole("generic")
      .filter((element) => element.className === "bg-red-50 p-4 rounded-lg");

    // Total Premiums card ($3,000)
    const totalCard = summaryCards.find((card) =>
      within(card).queryByText("Total Premiums")
    );
    expect(within(totalCard!).getByText("$3,000")).toBeInTheDocument();

    // Average Premium card ($1,000)
    const averageCard = summaryCards.find((card) =>
      within(card).queryByText("Average Premium")
    );
    expect(within(averageCard!).getByText("$1,000")).toBeInTheDocument();
  });

  it("processes data correctly for the chart", () => {
    render(<PremiumTrendsChart policies={mockPolicies} />);

    const chartElement = screen.getByTestId("line-chart");
    const chartData = JSON.parse(
      chartElement.getAttribute("data-chart-data") || "[]"
    );

    // Check January data (2 policies)
    const janEntry = chartData.find((d: any) => d.date === "2024-01");
    expect(janEntry).toEqual({
      date: "2024-01",
      totalPremium: 1800, // 1000 + 800
      averagePremium: 900, // (1000 + 800) / 2
      policyCount: 2,
    });

    // Check February data (1 policy)
    const febEntry = chartData.find((d: any) => d.date === "2024-02");
    expect(febEntry).toEqual({
      date: "2024-02",
      totalPremium: 1200,
      averagePremium: 1200,
      policyCount: 1,
    });

    // Verify data is sorted by date
    expect(chartData).toEqual(
      chartData.sort((a: any, b: any) => a.date.localeCompare(b.date))
    );
  });

  it("renders both total and average premium lines", () => {
    render(<PremiumTrendsChart policies={mockPolicies} />);

    const totalPremiumLine = screen.getByTestId("line-totalPremium");
    const averagePremiumLine = screen.getByTestId("line-averagePremium");

    expect(totalPremiumLine).toHaveAttribute("data-name", "Total Premium");
    expect(averagePremiumLine).toHaveAttribute("data-name", "Average Premium");
  });

  it("handles empty policy array", () => {
    render(<PremiumTrendsChart policies={[]} />);

    const summaryCards = screen
      .getAllByRole("generic")
      .filter((element) => element.className === "bg-red-50 p-4 rounded-lg");

    // Check that totals are zero
    const totalCard = summaryCards.find((card) =>
      within(card).queryByText("Total Premiums")
    );
    expect(within(totalCard!).getByText("$0")).toBeInTheDocument();

    // Check that chart still renders
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("groups policies by month correctly", () => {
    const policiesAcrossMonths: Policy[] = [
      {
        id: 1,
        type: "Health",
        status: "active",
        details: "Health Plan A",
        startDate: "2024-01-15",
        endDate: "2024-12-31",
        coverageDetails: "Full coverage",
        premiumAmount: 1000,
        documentUrl: "https://example.com/doc1",
      },
      {
        id: 2,
        type: "Health",
        status: "active",
        details: "Health Plan B",
        startDate: "2024-01-20",
        endDate: "2024-12-31",
        coverageDetails: "Full coverage",
        premiumAmount: 1500,
        documentUrl: "https://example.com/doc2",
      },
      {
        id: 3,
        type: "Auto",
        status: "active",
        details: "Auto Plan A",
        startDate: "2024-02-01",
        endDate: "2024-12-31",
        coverageDetails: "Full coverage",
        premiumAmount: 800,
        documentUrl: "https://example.com/doc3",
      },
    ];

    render(<PremiumTrendsChart policies={policiesAcrossMonths} />);

    const chartElement = screen.getByTestId("line-chart");
    const chartData = JSON.parse(
      chartElement.getAttribute("data-chart-data") || "[]"
    );

    expect(chartData).toEqual([
      {
        date: "2024-01",
        totalPremium: 2500,
        averagePremium: 1250,
        policyCount: 2,
      },
      {
        date: "2024-02",
        totalPremium: 800,
        averagePremium: 800,
        policyCount: 1,
      },
    ]);
  });
});
