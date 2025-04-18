import { useState } from "react";
import type { Question } from "@/types";

/**
 * Custom hook for managing question form state and operations
 *
 * @param initial - The initial question data to populate the form
 * @returns An object containing the current question state and handler functions
 *
 * This hook provides functionality for:
 * - Managing question form state
 * - Handling form field changes
 * - Special handling for different question types (single, multiple, judgement)
 * - Managing question options including text and correctness
 * - Handling media file uploads
 */
export const useQuestionForm = (initial: Question) => {
  const [question, setQuestion] = useState<Question>(initial);

  /**
   * Updates a specific field in the question object
   *
   * @param field - The field name to update
   * @param value - The new value for the field
   *
   * Special handling for question type changes:
   * - When changing to "judgement" type, resets options to True/False
   * - When changing from "judgement" to other types, resets options to empty
   */
  const handleChange = <K extends keyof Question>(
    field: K,
    value: Question[K]
  ) => {
    const updated = { ...question, [field]: value };

    if (field === "type" && value === "judgement") {
      updated.options = [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: false },
      ];
    }
    if (
      field === "type" &&
      question.type === "judgement" &&
      (value === "single" || value === "multiple")
    ) {
      updated.options = [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ];
    }

    setQuestion(updated);
  };

  /**
   * Updates the text of a specific option
   *
   * @param index - The index of the option to update
   * @param value - The new text value for the option
   */
  const handleOptionChange = (index: number, value: string) => {
    const updated = [...question.options];
    updated[index].text = value;
    handleChange("options", updated);
  };

  /**
   * Toggles the correctness of a specific option
   *
   * @param index - The index of the option to toggle
   */
  const handleCorrectToggle = (index: number) => {
    const updated = [...question.options];
    updated[index].isCorrect = !updated[index].isCorrect;
    handleChange("options", updated);
  };

  /**
   * Handles media file uploads for the question
   * Converts the uploaded file to a base64 data URL
   *
   * @param e - The file input change event
   */
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("media", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return {
    question,
    setQuestion,
    handleChange,
    handleOptionChange,
    handleCorrectToggle,
    handleMediaUpload,
  };
};
