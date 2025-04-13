// src/hooks/useQuestionForm.ts
import { useState } from "react";
import type { Question } from "@/types";

export const useQuestionForm = (initial: Question) => {
  const [question, setQuestion] = useState<Question>(initial);

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

    setQuestion(updated);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...question.options];
    updated[index].text = value;
    handleChange("options", updated);
  };

  const handleCorrectToggle = (index: number) => {
    const updated = [...question.options];
    updated[index].isCorrect = !updated[index].isCorrect;
    handleChange("options", updated);
  };

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
