// src/components/claims/ClaimList.test.tsx
import React from "react";
import { render, screen } from "../../test-utils";
import ClaimList from "./ClaimList";
import { Claim } from "../../types";

describe("ClaimList", () => {
  const mockGetStatusColor = jest.fn((status) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500";
      case "under_review":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  });

  const mockOnSelectClaim = jest.fn();

  const sampleClaims: Claim[] = [
    {
      id: 1,
      userId: 2,
      policyId: 3,
      claimType: "Car",
      description: "Accident",
      files: ["uploads/claim1/image1.jpg", "uploads/claim1/document1.pdf"],
      status: "submitted",
      submittedAt: "2023-09-01T10:00:00Z",
      history: [
        {
          stage: "Submitted",
          date: "2023-09-01T10:00:00Z",
          remarks: "Claim submitted by user.",
        },
      ],
    },
    {
      id: 2,
      userId: 4,
      policyId: 5,
      claimType: "Health",
      description: "Surgery",
      files: ["uploads/claim2/image1.jpg", "uploads/claim2/document1.pdf"],
      status: "approved",
      submittedAt: "2023-09-05T12:30:00Z",
      history: [
        {
          stage: "Submitted",
          date: "2023-09-05T12:30:00Z",
          remarks: "Claim submitted by user.",
        },
        {
          stage: "Under Review",
          date: "2023-09-06T09:15:00Z",
          remarks: "Claim is being reviewed by the team.",
        },
        {
          stage: "Approved",
          date: "2023-09-10T14:45:00Z",
          remarks: "Claim approved by the manager.",
        },
      ],
    },
  ];

  it("renders a list of claims", () => {
    render(
      <ClaimList
        claims={sampleClaims}
        getStatusColor={mockGetStatusColor}
        onSelectClaim={mockOnSelectClaim}
      />
    );

    sampleClaims.forEach((claim) => {
      expect(screen.getByText(`Claim #${claim.id}`)).toBeInTheDocument();
      expect(screen.getByText(`Type: ${claim.claimType}`)).toBeInTheDocument();
      expect(
        screen.getByText(claim.status.replace("_", " ").toUpperCase())
      ).toBeInTheDocument();
    });
  });

  it("renders no claims message when claims array is empty", () => {
    render(
      <ClaimList
        claims={[]}
        getStatusColor={mockGetStatusColor}
        onSelectClaim={mockOnSelectClaim}
      />
    );

    expect(screen.queryByText(/claim #/i)).not.toBeInTheDocument();
    // Depending on implementation, you might have a message like "No claims found"
    // Uncomment and adjust the following line based on your actual message
    // expect(screen.getByText(/no claims found/i)).toBeInTheDocument();
  });
});
