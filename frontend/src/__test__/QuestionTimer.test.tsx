import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import QuestionTimer from "../components/game/QuestionTimer";

describe("QuestionTimer Component", () => {
  // Test 1: Renders correctly with remaining time
  it("renders with correct remaining time text", () => {
    render(
      <QuestionTimer
        remainingTime={30}
        progressValue={75}
        questionTypeLabel="Multiple Choice"
      />
    );

    expect(screen.getByText("30s remaining")).toBeInTheDocument();
    expect(screen.getByText("Multiple Choice")).toBeInTheDocument();
  });

  // Test 2: Shows "Time's up!" when time is 0
  it('shows "Time\'s up!" when remainingTime is 0', () => {
    render(
      <QuestionTimer
        remainingTime={0}
        progressValue={0}
        questionTypeLabel="Multiple Choice"
      />
    );

    expect(screen.getByText("Time's up!")).toBeInTheDocument();
  });

  // Test 3: Renders the progress bar with correct value
  it("renders progress bar with correct value", () => {
    render(
      <QuestionTimer
        remainingTime={15}
        progressValue={50}
        questionTypeLabel="Multiple Choice"
      />
    );

    const progressIndicator = screen
      .getByRole("progressbar")
      .querySelector('[data-slot="progress-indicator"]');
    expect(progressIndicator).toHaveStyle({ transform: "translateX(-50%)" });
  });

  // Test 4: Displays the correct question type label
  it("displays the correct question type label", () => {
    render(
      <QuestionTimer
        remainingTime={20}
        progressValue={60}
        questionTypeLabel="True/False"
      />
    );

    expect(screen.getByText("True/False")).toBeInTheDocument();
  });

  // Test 5: Returns null when remainingTime is null
  it("returns null when remainingTime is null", () => {
    const { container } = render(
      <QuestionTimer
        remainingTime={null}
        progressValue={0}
        questionTypeLabel="Multiple Choice"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  // Test 6: Shows icon with remaining time
  it("shows clock icon with remaining time", () => {
    render(
      <QuestionTimer
        remainingTime={5}
        progressValue={10}
        questionTypeLabel="Multiple Choice"
      />
    );

    // Check for the time text next to the clock icon
    expect(screen.getByText("5s remaining")).toBeInTheDocument();

    // The parent element should have both the icon and the text
    const timeDisplay = screen.getByText("5s remaining").parentElement;
    expect(timeDisplay).toBeInTheDocument();
    expect(timeDisplay?.querySelector("svg")).toBeInTheDocument();
  });

  // Test 7: Edge case - Progress value at 100%
  it("handles progress value at 100%", () => {
    render(
      <QuestionTimer
        remainingTime={1}
        progressValue={100}
        questionTypeLabel="Multiple Choice"
      />
    );

    const progressIndicator = screen
      .getByRole("progressbar")
      .querySelector('[data-slot="progress-indicator"]');
    expect(progressIndicator).toHaveStyle({ transform: "translateX(-0%)" });
  });

  // Test 8: Edge case - Progress value at 0%
  it("handles progress value at 0%", () => {
    render(
      <QuestionTimer
        remainingTime={0}
        progressValue={0}
        questionTypeLabel="Multiple Choice"
      />
    );

    const progressIndicator = screen
      .getByRole("progressbar")
      .querySelector('[data-slot="progress-indicator"]');
    expect(progressIndicator).toHaveStyle({ transform: "translateX(-100%)" });
  });
});
