import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OptionButton from "../components/game/OptionButton";

describe("OptionButton Component", () => {
  // Test 1: Renders with correct text
  it("renders with the provided text", () => {
    render(
      <OptionButton
        text="Answer Option"
        isSelected={false}
        isTimeUp={false}
        onClick={() => {}}
      />
    );

    expect(screen.getByText("Answer Option")).toBeInTheDocument();
  });

  // Test 2: Shows selected state correctly
  it("shows selected state when isSelected is true", () => {
    const { container } = render(
      <OptionButton
        text="Answer Option"
        isSelected={true}
        isTimeUp={false}
        onClick={() => {}}
      />
    );

    // Check for primary border class
    const button = container.querySelector("button");
    expect(button).toHaveClass("border-primary");
    expect(button).toHaveClass("bg-primary/5");
  });

  // Test 3: Shows unselected state correctly
  it("shows unselected state when isSelected is false", () => {
    const { container } = render(
      <OptionButton
        text="Answer Option"
        isSelected={false}
        isTimeUp={false}
        onClick={() => {}}
      />
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("border-gray-200");
    expect(button).not.toHaveClass("border-primary");
  });

  // Test 4: Calls onClick when clicked
  it("calls onClick function when clicked", () => {
    const handleClick = vi.fn();

    render(
      <OptionButton
        text="Answer Option"
        isSelected={false}
        isTimeUp={false}
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByText("Answer Option"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 5: Disables button when time is up
  it("disables the button when isTimeUp is true", () => {
    render(
      <OptionButton
        text="Answer Option"
        isSelected={false}
        isTimeUp={true}
        isCorrect={false}
        onClick={() => {}}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("cursor-default");
  });

  // Test 6: Shows correct answer indicator when isCorrect is true and time is up
  it("shows correct answer indicator when isCorrect is true and time is up", () => {
    const { container } = render(
      <OptionButton
        text="Answer Option"
        isSelected={false}
        isTimeUp={true}
        isCorrect={true}
        onClick={() => {}}
      />
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("border-green-500");
    expect(button).toHaveClass("bg-green-50");

    // Should show check circle icon for correct answer
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  // Test 7: Shows incorrect answer indicator when selected, incorrect and time is up
  it("shows incorrect indicator when selected, incorrect and time is up", () => {
    const { container } = render(
      <OptionButton
        text="Answer Option"
        isSelected={true}
        isTimeUp={true}
        isCorrect={false}
        onClick={() => {}}
      />
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("border-red-500");
    expect(button).toHaveClass("bg-red-50");

    // Should show X circle icon for incorrect selected answer
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  // Test 8: Shows normal state for unselected incorrect options when time is up
  it("shows normal state for unselected incorrect options when time is up", () => {
    const { container } = render(
      <OptionButton
        text="Answer Option"
        isSelected={false}
        isTimeUp={true}
        isCorrect={false}
        onClick={() => {}}
      />
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("border-gray-200");
    expect(button).not.toHaveClass("border-red-500");
    expect(button).not.toHaveClass("border-green-500");
  });
});
