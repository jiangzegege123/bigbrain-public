import { Question } from "@/types";
import QuestionTimer from "@/components/game/QuestionTimer";
import OptionsList from "@/components/game/OptionsList";
import ResultDisplay from "@/components/game/ResultDisplay";
import QuestionMedia from "@/components/game/QuestionMedia";

interface QuestionViewProps {
  question: Question;
  remainingTime: number | null;
  selected: number[];
  correctAnswers: number[] | null;
  showResult: boolean;
  onOptionClick: (idx: number) => void;
  getProgressValue: () => number;
  getQuestionTypeLabel: () => string;
}

const QuestionView = ({
  question,
  remainingTime,
  selected,
  correctAnswers,
  showResult,
  onOptionClick,
  getProgressValue,
  getQuestionTypeLabel,
}: QuestionViewProps) => {
  console.log(question);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <QuestionTimer
          remainingTime={remainingTime}
          progressValue={getProgressValue()}
          questionTypeLabel={getQuestionTypeLabel()}
        />
        <h2 className="text-2xl font-bold mt-4">{question.question}</h2>
      </div>

      {question.media && <QuestionMedia media={question.media} />}

      <OptionsList
        question={question}
        selected={selected}
        correctAnswers={correctAnswers}
        remainingTime={remainingTime}
        onOptionClick={onOptionClick}
      />

      <ResultDisplay
        correctAnswers={correctAnswers}
        selected={selected}
        show={showResult}
      />
    </div>
  );
};

export default QuestionView;
