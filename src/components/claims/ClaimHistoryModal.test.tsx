// src/components/claims/ClaimHistoryModal.test.tsx

import React from "react";
import { render, screen, fireEvent } from "../../test-utils";
import ClaimHistoryModal from "./ClaimHistoryModal";
import { Claim } from "../../types";
import { formatDate } from "../../utils/helpers";

describe("ClaimHistoryModal", () => {
  const mockOnClose = jest.fn();

  const sampleClaim: Claim = {
    id: 3,
    userId: 1,
    policyId: 1,
    claimType: "House",
    description: "Arson",
    files: ["uploads/claim2/image1.jpg", "uploads/claim2/document1.pdf"],
    status: "rejected",
    submittedAt: "2023-08-05T15:45:00Z",
    history: [
      {
        stage: "Submitted",
        date: "2023-08-05T15:45:00Z",
        remarks: "Claim submitted by user.",
      },
      {
        stage: "Under Review",
        date: "2023-08-07T11:30:00Z",
        remarks: "Claim is being reviewed by the team.",
      },
      {
        stage: "Rejected",
        date: "2023-08-10T16:00:00Z", // ISO string
        remarks:
          "Upon investigation, it was realized that the said house didn't belong to user.",
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it("renders correctly when claim is provided", () => {
    render(<ClaimHistoryModal claim={sampleClaim} onClose={mockOnClose} />);

    expect(
      screen.getByText(`Claim: ${sampleClaim.claimType}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Claim ID: #${sampleClaim.id}`)
    ).toBeInTheDocument();

    // Check for each history entry
    sampleClaim.history.forEach((entry) => {
      expect(screen.getByText(entry.stage)).toBeInTheDocument();
      expect(screen.getByText(entry.remarks)).toBeInTheDocument();
      expect(screen.getByText(formatDate(entry.date))).toBeInTheDocument();
    });
  });

  it("does not render when claim is null", () => {
    const { container } = render(
      <ClaimHistoryModal claim={null} onClose={mockOnClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls onClose when backdrop is clicked", () => {
    render(<ClaimHistoryModal claim={sampleClaim} onClose={mockOnClose} />);
    const backdrop = screen.getByTestId("backdrop"); // Updated selector

    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    render(<ClaimHistoryModal claim={sampleClaim} onClose={mockOnClose} />);
    const closeButton = screen.getByRole("button", { name: /close/i });

    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
