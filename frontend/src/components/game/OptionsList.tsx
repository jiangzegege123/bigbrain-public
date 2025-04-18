import { Question } from "@/types";
import OptionButton from "./OptionButton";

interface OptionsListProps {
  question: Question;
  selected: number[];
  correctAnswers: number[] | null;
  remainingTime: number | null;
  onOptionClick: (idx: number) => void;
}

const OptionsList = ({
  question,
  selected,
  correctAnswers,
  remainingTime,
  onOptionClick,
}: OptionsListProps) => {
  const isTimeUp = remainingTime === 0;

  return (
    <div className="grid gap-3">
      {question.options.map((opt, idx) => {
        const isSelected = selected.includes(idx);
        const isCorrect = correctAnswers?.includes(idx);

        return (
          <OptionButton
            key={idx}
            text={opt.text}
            isSelected={isSelected}
            isCorrect={isCorrect}
            isTimeUp={isTimeUp}
            onClick={() => onOptionClick(idx)}
          />
        );
      })}
      
      {question.type === "multiple" && (
        <p className="text-sm text-muted-foreground italic">
          Select all correct answers that apply
        </p>
      )}
    </div>
  );
};

export default OptionsList; 