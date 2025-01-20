// src/components/claims/ClaimItem.test.tsx
import { fireEvent, render, screen } from "../../test-utils";
import { Claim } from "../../types";
import ClaimItem from "./ClaimItem";

describe("ClaimItem", () => {
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

  const sampleClaim: Claim = {
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
  };

  it("renders claim details correctly", () => {
    render(
      <ClaimItem
        claim={sampleClaim}
        getStatusColor={mockGetStatusColor}
        onSelectClaim={mockOnSelectClaim}
      />
    );

    expect(screen.getByText(`Claim #${sampleClaim.id}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Type: ${sampleClaim.claimType}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleClaim.status.replace("_", " ").toUpperCase())
    ).toBeInTheDocument();
  });

  it('calls onSelectClaim when "View Status" button is clicked', () => {
    render(
      <ClaimItem
        claim={sampleClaim}
        getStatusColor={mockGetStatusColor}
        onSelectClaim={mockOnSelectClaim}
      />
    );

    const viewStatusButton = screen.getByText(/view status/i);
    fireEvent.click(viewStatusButton);

    expect(mockOnSelectClaim).toHaveBeenCalledWith(sampleClaim);
  });
});
