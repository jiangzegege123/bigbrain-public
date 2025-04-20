import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EmptyState from "../components/ui/EmptyState";

// Mock the Button component to simplify testing
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button onClick={onClick} data-testid="mock-button">
      {children}
    </button>
  ),
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  PlusCircle: () => <div data-testid="plus-circle-icon" />,
  Gamepad2: () => <div data-testid="gamepad-icon" />,
}));

describe("EmptyState Component", () => {
  // Test 1: Renders with correct content
  it("renders with correct content", () => {
    const handleCreate = vi.fn();
    render(<EmptyState onCreate={handleCreate} />);

    // Check for heading and description text
    expect(screen.getByText("No games found")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first game to get started")
    ).toBeInTheDocument();

    // Check for create button
    expect(screen.getByTestId("mock-button")).toBeInTheDocument();
    expect(screen.getByText("Create Game")).toBeInTheDocument();
  });

  // Test 2: Displays icons
  it("displays the correct icons", () => {
    const handleCreate = vi.fn();
    render(<EmptyState onCreate={handleCreate} />);

    // Check for Gamepad icon
    expect(screen.getByTestId("gamepad-icon")).toBeInTheDocument();

    // Check for Plus Circle icon (inside button)
    expect(screen.getByTestId("plus-circle-icon")).toBeInTheDocument();
  });

  // Test 3: Calls the onCreate handler when button is clicked
  it("calls onCreate when the button is clicked", () => {
    const handleCreate = vi.fn();
    render(<EmptyState onCreate={handleCreate} />);

    const button = screen.getByTestId("mock-button");
    fireEvent.click(button);

    expect(handleCreate).toHaveBeenCalledTimes(1);
  });

  // Test 4: Has the correct styling
  it("has the correct styling classes", () => {
    const handleCreate = vi.fn();
    const { container } = render(<EmptyState onCreate={handleCreate} />);

    // Check main container has the correct classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("text-center");
    expect(mainDiv).toHaveClass("bg-white");
    expect(mainDiv).toHaveClass("rounded-lg");
    expect(mainDiv).toHaveClass("border");
    expect(mainDiv).toHaveClass("border-gray-200");

    // Check heading has correct styling
    const heading = screen.getByText("No games found");
    expect(heading).toHaveClass("text-xl");
    expect(heading).toHaveClass("font-semibold");
    expect(heading).toHaveClass("text-gray-700");

    // Check description has correct styling
    const description = screen.getByText(
      "Create your first game to get started"
    );
    expect(description).toHaveClass("text-gray-500");
  });

  // Test 5: Works with screen readers and accessibility
  it("has accessible structure", () => {
    const handleCreate = vi.fn();
    render(<EmptyState onCreate={handleCreate} />);

    // Heading should be properly structured for screen readers
    const heading = screen.getByText("No games found");
    expect(heading.tagName).toBe("H2");

    // Button should be accessible
    const button = screen.getByTestId("mock-button");
    expect(button).toBeInTheDocument();
  });
});
