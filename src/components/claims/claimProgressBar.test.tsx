// src/components/claims/ClaimProgressBar.test.tsx
import React from "react";
import { render, screen } from "../../test-utils";
import ClaimProgressBar from "./ClaimProgressBar";
import { ClaimStatus } from "../../types";

describe("ClaimProgressBar", () => {
  const stages = ["Submitted", "Under Review", "Approved", "Rejected"];

  const renderComponent = (status: ClaimStatus) => {
    render(<ClaimProgressBar status={status} />);
  };

  it("renders all stages", () => {
    renderComponent("submitted");

    stages.forEach((stage) => {
      expect(screen.getByText(stage)).toBeInTheDocument();
    });
  });

  it("highlights the correct stage based on status", () => {
    renderComponent("under_review");

    // Check that stages up to 'Under Review' have the check icon
    expect(screen.getAllByRole("img", { hidden: true }).length).toBe(2); // Assuming check icons have role img

    // The third and fourth stages should not have the check icon
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("renders correctly for approved status", () => {
    renderComponent("approved");

    // Check that stages up to 'Approved' have the check icon
    expect(screen.getAllByRole("img", { hidden: true }).length).toBe(3);
  });

  it("renders correctly for rejected status", () => {
    renderComponent("rejected");

    // Check that all stages up to 'Rejected' have the check icon
    expect(screen.getAllByRole("img", { hidden: true }).length).toBe(4);
  });
});
