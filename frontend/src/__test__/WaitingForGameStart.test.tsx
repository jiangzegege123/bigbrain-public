import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WaitingForGameStart from "../components/game/WaitingForGameStart";

describe("WaitingForGameStart Component", () => {
  // Test 1: Renders heading correctly
  it("renders the waiting message heading", () => {
    render(<WaitingForGameStart />);

    expect(
      screen.getByText("Waiting for the game to start...")
    ).toBeInTheDocument();
    expect(screen.getByText("Waiting for the game to start...").tagName).toBe(
      "H2"
    );
  });

  // Test 2: Renders secondary message correctly
  it("renders the secondary message", () => {
    render(<WaitingForGameStart />);

    expect(
      screen.getByText("Get ready! The quiz will begin soon.")
    ).toBeInTheDocument();
  });

  // Test 3: Renders the spinner
  it("renders a loading spinner", () => {
    const { container } = render(<WaitingForGameStart />);

    const spinnerIcon = container.querySelector("svg");
    expect(spinnerIcon).toBeInTheDocument();
    expect(spinnerIcon).toHaveClass("animate-spin");
  });

  // Test 4: Applies correct styling to container
  it("applies correct layout styles to the container", () => {
    const { container } = render(<WaitingForGameStart />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("flex-col");
    expect(mainContainer).toHaveClass("items-center");
    expect(mainContainer).toHaveClass("justify-center");
  });

  // Test 5: Heading has correct styling
  it("applies correct styling to the heading", () => {
    render(<WaitingForGameStart />);

    const heading = screen.getByText("Waiting for the game to start...");
    expect(heading).toHaveClass("text-2xl");
    expect(heading).toHaveClass("font-semibold");
    expect(heading).toHaveClass("text-center");
  });

  // Test 6: Paragraph has correct styling
  it("applies correct styling to the paragraph", () => {
    render(<WaitingForGameStart />);

    const paragraph = screen.getByText("Get ready! The quiz will begin soon.");
    expect(paragraph).toHaveClass("text-muted-foreground");
    expect(paragraph).toHaveClass("text-center");
  });

  // Test 7: Container has margin between elements
  it("has vertical spacing between elements", () => {
    const { container } = render(<WaitingForGameStart />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("space-y-4");
  });

  // Test 8: Spinner has correct size
  it("applies correct size to the spinner", () => {
    const { container } = render(<WaitingForGameStart />);

    const spinnerIcon = container.querySelector("svg");
    expect(spinnerIcon).toHaveClass("h-12");
    expect(spinnerIcon).toHaveClass("w-12");
  });
});
