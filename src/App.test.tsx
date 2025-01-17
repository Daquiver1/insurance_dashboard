// src/App.test.tsx
import React from "react";
import { render, screen } from "./test-utils"; // Adjust the path if necessary
import App from "./App";

test("renders Dashboard Overview", () => {
  render(<App />);
  const headingElement = screen.getByText(/Dashboard Overview/i);
  expect(headingElement).toBeInTheDocument();
});
