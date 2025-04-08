import { Link } from "react-router-dom";
import { Clock, HelpCircle, Gamepad2 } from "lucide-react";
import type { Game, Question } from "@/types/index";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const totalDuration = game.questions.reduce(
    (sum: number, q: Question) => sum + q.duration,
    0
  );

  return (
    <Link
      to={`/game/${game.id}`}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow hover:shadow-md transition group"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={`${game.name} thumbnail`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Gamepad2 className="h-12 w-12 text-gray-300" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{game.name}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span>{game.questions.length} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{totalDuration} seconds</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
