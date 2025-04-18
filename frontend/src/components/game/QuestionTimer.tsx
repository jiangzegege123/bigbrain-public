import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuestionTimerProps {
  remainingTime: number | null;
  progressValue: number;
  questionTypeLabel: string;
}

const QuestionTimer = ({
  remainingTime,
  progressValue,
  questionTypeLabel,
}: QuestionTimerProps) => {
  if (remainingTime === null) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {remainingTime > 0 ? `${remainingTime}s remaining` : "Time's up!"}
          </span>
        </div>
        <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
          {questionTypeLabel}
        </span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
};

export default QuestionTimer; 