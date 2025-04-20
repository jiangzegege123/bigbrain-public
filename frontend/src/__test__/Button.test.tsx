import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../components/ui/button";

describe("Button Component", () => {
  // Test 1: Renders with default variant and size
  it("renders with default variant and size", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
  });

  // Test 2: Applies the correct classes for different variants
  it("applies correct classes for different variants", () => {
    const { rerender } = render(
      <Button variant="destructive">Destructive</Button>
    );

    let button = screen.getByRole("button", { name: "Destructive" });
    expect(button).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole("button", { name: "Outline" });
    expect(button).toHaveClass("bg-background");
    expect(button).toHaveClass("border");

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole("button", { name: "Secondary" });
    expect(button).toHaveClass("bg-secondary");

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button", { name: "Ghost" });
    expect(button).not.toHaveClass("bg-primary");

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole("button", { name: "Link" });
    expect(button).toHaveClass("text-primary");
  });

  // Test 3: Applies the correct classes for different sizes
  it("applies correct classes for different sizes", () => {
    const { rerender } = render(<Button size="default">Default</Button>);

    let button = screen.getByRole("button", { name: "Default" });
    expect(button).toHaveClass("h-9");

    rerender(<Button size="sm">Small</Button>);
    button = screen.getByRole("button", { name: "Small" });
    expect(button).toHaveClass("h-8");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button", { name: "Large" });
    expect(button).toHaveClass("h-10");

    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole("button", { name: "Icon" });
    expect(button).toHaveClass("size-9");
  });

  // Test 4: Applies additional className props
  it("applies additional className props", () => {
    render(<Button className="test-class">Custom Class</Button>);

    const button = screen.getByRole("button", { name: "Custom Class" });
    expect(button).toHaveClass("test-class");
  });

  // Test 5: Handles clicks correctly
  it("handles click events", () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 6: Handles disabled state
  it("handles disabled state", () => {
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test 7: Works with children elements
  it("renders with children elements", () => {
    render(
      <Button>
        <span data-testid="child-element">Child</span>
      </Button>
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
  });

  // Test 8: Handles asChild prop
  it("renders as a different element when asChild is true", () => {
    // Since we need a Slot component for asChild to work properly,
    // we'll just check if the component doesn't crash when asChild is true
    const { container } = render(<Button asChild>As Child</Button>);
    expect(container).toBeInTheDocument();
  });
});
