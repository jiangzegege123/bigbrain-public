import { Loader2, Clock, Award, XCircle } from "lucide-react";

interface ResultDisplayProps {
  correctAnswers: number[] | null;
  selected: number[];
  show: boolean;
}

const ResultDisplay = ({
  correctAnswers,
  selected,
  show,
}: ResultDisplayProps) => {
  if (!show) return null;

  return (
    <div className="mt-6 p-4 rounded-lg bg-gray-50 border flex items-center justify-center gap-3">
      {correctAnswers === null ? (
        <>
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="text-xl font-semibold text-primary">
            Checking answer...
          </span>
        </>
      ) : correctAnswers.length === 0 ? (
        <>
          <Clock className="h-6 w-6 text-amber-500" />
          <span className="text-xl font-semibold text-amber-600">
            Waiting for results...
          </span>
        </>
      ) : JSON.stringify(correctAnswers.sort()) ===
        JSON.stringify(selected.sort()) ? (
        <>
          <Award className="h-6 w-6 text-green-500" />
          <span className="text-xl font-semibold text-green-600">
            Correct Answer!
          </span>
        </>
      ) : (
        <>
          <XCircle className="h-6 w-6 text-red-500" />
          <span className="text-xl font-semibold text-red-600">
            Incorrect Answer
          </span>
        </>
      )}
    </div>
  );
};

export default ResultDisplay;
