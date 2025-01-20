import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("renders with default message", () => {
    render(<EmptyState type="claims" />);

    expect(screen.getByText("No Claims Found")).toBeInTheDocument();
    expect(
      screen.getByText("No claims have been submitted yet.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("file-text-icon")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    const customMessage = "Custom empty state message";
    render(<EmptyState type="policies" message={customMessage} />);

    expect(screen.getByText("No Policies Found")).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("capitalizes the first letter of the type", () => {
    render(<EmptyState type="documents" />);
    expect(screen.getByText("No Documents Found")).toBeInTheDocument();
  });
});
