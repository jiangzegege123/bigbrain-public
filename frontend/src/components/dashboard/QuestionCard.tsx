import { Link } from "react-router-dom";
import { Clock, HelpCircle, Award, Edit2, Trash2 } from "lucide-react";
import type { Question } from "@/types/index";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
  question: Question; // The question data
  index: number; // The index of the question in the list
  gameId: number; // ID of the game the question belongs to
  onDelete: (id: number) => void; // Callback when delete is triggered
}

/**
 * Component to display a single question as a card.
 * Shows metadata like duration, points, and type, and provides edit/delete actions.
 */
const QuestionCard = ({
  question,
  index,
  gameId,
  onDelete,
}: QuestionCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Card header with question number */}
      <div className="bg-gray-700 py-3 px-4">
        <h2 className="font-semibold text-white flex items-center">
          <HelpCircle className="h-4 w-4 mr-2" />
          Question {index + 1}
        </h2>
      </div>

      {/* Card content */}
      <div className="p-4">
        {/* Question text */}
        <p className="text-gray-700 font-medium mb-4 line-clamp-2 min-h-[3rem]">
          {question.question || "New question"}
        </p>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            {question.duration}s
          </div>
          <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            <Award className="h-3 w-3 mr-1" />
            {question.points} pts
          </div>
          <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {question.type}
          </div>
        </div>

        {/* Edit and delete actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <Link
            to={`/game/${gameId}/question/${question.id}`}
            className="w-full mr-2"
          >
            <Button variant="outline" className="w-full">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>

          {/* Show delete button only if the question has a valid ID */}
          {typeof question.id === "number" && (
            <Button
              variant="destructive"
              onClick={() => onDelete(question.id!)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
