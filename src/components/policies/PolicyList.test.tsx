import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { createMockPolicy } from "../../test-utils";
import PolicyList from "./PolicyList";

const renderPolicyList = (policies = [createMockPolicy()]) => {
  return render(
    <BrowserRouter>
      <PolicyList policies={policies} />
    </BrowserRouter>
  );
};

describe("PolicyList", () => {
  it("renders multiple policies correctly", () => {
    const policies = [
      createMockPolicy({ id: 1, type: "Home" }),
      createMockPolicy({ id: 2, type: "Auto" }),
      createMockPolicy({ id: 3, type: "Health" }),
    ];

    renderPolicyList(policies);

    expect(screen.getByText("Home Policy")).toBeInTheDocument();
    expect(screen.getByText("Auto Policy")).toBeInTheDocument();
    expect(screen.getByText("Health Policy")).toBeInTheDocument();
  });
});
