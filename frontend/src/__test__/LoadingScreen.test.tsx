import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingScreen from "../components/game/LoadingScreen";

describe("LoadingScreen Component", () => {
  // Test 1: Renders with default message
  it("renders with default 'Loading...' message when no message prop is provided", () => {
    render(<LoadingScreen />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Test 2: Renders with custom message
  it("renders with custom message when provided", () => {
    const customMessage = "Please wait while we set up your game...";
    render(<LoadingScreen message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  // Test 3: Renders the spinner icon
  it("renders a spinner icon", () => {
    const { container } = render(<LoadingScreen />);

    // Check for Loader2 icon (spinner)
    const spinnerIcon = container.querySelector("svg");
    expect(spinnerIcon).toBeInTheDocument();
    expect(spinnerIcon).toHaveClass("animate-spin");
  });

  // Test 4: Applies correct styling to message
  it("applies correct styling to the message", () => {
    render(<LoadingScreen />);

    const messageElement = screen.getByText("Loading...");
    expect(messageElement).toHaveClass("text-lg");
    expect(messageElement).toHaveClass("text-muted-foreground");
  });

  // Test 5: Container has proper layout classes
  it("applies proper layout classes to the container", () => {
    const { container } = render(<LoadingScreen />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("flex-col");
    expect(mainContainer).toHaveClass("items-center");
    expect(mainContainer).toHaveClass("justify-center");
  });

  // Test 6: Edge case - Empty string message
  it("renders empty string message when provided", () => {
    const { container } = render(<LoadingScreen message="" />);

    // The paragraph should exist but be empty
    const emptyMessage = container.querySelector("p");
    expect(emptyMessage).toBeInTheDocument();
    expect(emptyMessage).toHaveTextContent("");
  });

  // Test 7: Edge case - Long message
  it("handles long messages correctly", () => {
    const longMessage =
      "This is a very long loading message that could potentially wrap to multiple lines depending on the container width and should still be displayed correctly without truncation";
    render(<LoadingScreen message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  // Test 8: Spinner has proper size classes
  it("applies proper size classes to the spinner", () => {
    const { container } = render(<LoadingScreen />);

    const spinnerIcon = container.querySelector("svg");
    expect(spinnerIcon).toHaveClass("h-12");
    expect(spinnerIcon).toHaveClass("w-12");
  });
});
