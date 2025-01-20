// src/pages/ClaimHistory.test.tsx

import React from "react";
import { render, screen, fireEvent } from "../test-utils";
import ClaimHistory from "./ClaimHistory";
import { Claim } from "../types";

describe("ClaimHistory Component", () => {
  const mockClaims: Claim[] = [
    {
      id: 1,
      userId: 1,
      policyId: 1,
      claimType: "Home",
      description: "Water damage",
      files: ["test.pdf"],
      status: "approved",
      submittedAt: "2024-01-01T10:00:00Z",
      history: [
        {
          stage: "Submitted",
          date: "2024-01-01T10:00:00Z",
          remarks: "Initial submission",
        },
      ],
    },
    {
      id: 2,
      userId: 1,
      policyId: 2,
      claimType: "Auto",
      description: "Car accident",
      files: ["accident.jpg"],
      status: "under_review",
      submittedAt: "2024-01-02T10:00:00Z",
      history: [
        {
          stage: "Submitted",
          date: "2024-01-02T10:00:00Z",
          remarks: "Initial submission",
        },
      ],
    },
  ];

  it("shows loading state initially", () => {
    render(<ClaimHistory />, {
      initialState: {
        claims: { status: "loading", claims: [], error: null },
        policies: {},
        auth: {},
      },
    });

    expect(screen.getByText("Loading claims...")).toBeInTheDocument();
  });

  it("shows error state when fetch fails", () => {
    const errorMessage = "Failed to fetch claims";
    render(<ClaimHistory />, {
      initialState: {
        claims: { status: "failed", claims: [], error: errorMessage },
        policies: {},
        auth: {},
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("displays claims", () => {
    render(<ClaimHistory />, {
      initialState: {
        claims: { status: "succeeded", claims: mockClaims, error: null },
        policies: {},
        auth: {},
      },
    });

    // Check if all claims are initially displayed
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Auto")).toBeInTheDocument();
  });

  it("allows searching claims by type or ID", () => {
    render(<ClaimHistory />, {
      initialState: {
        claims: { status: "succeeded", claims: mockClaims, error: null },
        policies: {},
        auth: {},
      },
    });

    const searchInput = screen.getByPlaceholderText("Search claims...");

    // Search by claim type
    fireEvent.change(searchInput, { target: { value: "car accident" } });

    // Verify filtered list has single claim
    expect(
      screen.getAllByRole("button", { name: /View Status/i })
    ).toHaveLength(1);
  });

  it("shows empty state when no claims match filters", () => {
    render(<ClaimHistory />, {
      initialState: {
        claims: { status: "succeeded", claims: mockClaims, error: null },
        policies: {},
        auth: {},
      },
    });

    const searchInput = screen.getByPlaceholderText("Search claims...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    expect(
      screen.getByText("Try adjusting your search or filters.")
    ).toBeInTheDocument();
  });

  it("opens claim history modal when claim is selected", () => {
    render(<ClaimHistory />, {
      initialState: {
        claims: { status: "succeeded", claims: mockClaims, error: null },
        policies: {},
        auth: {},
      },
    });

    // Find and click the first claim
    const viewStatusLinks = screen.getAllByText("View Status");
    expect(viewStatusLinks).toHaveLength(2);

    const firstClaimElement = viewStatusLinks[0].closest("button");
    expect(firstClaimElement).toBeInTheDocument();

    fireEvent.click(firstClaimElement!);

    // Check if modal is opened with correct claim details
    expect(screen.getByText("Claim: Home")).toBeInTheDocument();
    expect(screen.getByText("Claim ID: #1")).toBeInTheDocument();
  });


});
