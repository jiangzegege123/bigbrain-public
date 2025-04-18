import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, HelpCircle, Gamepad2, X } from "lucide-react";
import type { Game, Question } from "@/types/index";
import { Button } from "../ui/button";

interface GameCardProps {
  game: Game;
  onDelete: (id: number) => void;
  onStartSession: (id: number) => void;
  onStopSession: (id: number) => void;
  onAdvanceGame: (id: number) => void;
}

const GameCard = ({
  game,
  onDelete,
  onStartSession,
  onStopSession,
  onAdvanceGame,
}: GameCardProps) => {
  const initialPosition = (() => {
    const saved = localStorage.getItem(`position-${game.id}`);
    return saved ? parseInt(saved, 10) : 0;
  })();

  const isActive = game.active != null;
  const [quizStarted, setQuizStarted] = useState(initialPosition > 0);
  const [showStartQuizConfirm, setShowStartQuizConfirm] = useState(false);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem(`position-${game.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const totalDuration = game.questions.reduce(
    (sum: number, q: Question) => sum + q.duration,
    0
  );

  // Handle delete button click (shows confirmation)
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  // Confirm game deletion
  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(game.id!);
    setShowConfirm(false);
  };

  // Cancel game deletion
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow hover:shadow-md transition group relative">
      <Link to={`/game/${game.id}`}>
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          {game.thumbnail ? (
            <img
              src={game.thumbnail || "/placeholder.svg"}
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
          <h2 className="text-lg font-semibold mb-2 flex">
            {game.name}
            <span className="text-sm font-light ml-auto text-gray-500">
              Click the box to edit the game
            </span>
          </h2>
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

      {/* Delete button or confirmation popup */}
      {!showConfirm ? (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 bg-white text-gray-600 rounded-full p-1.5 shadow-sm hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-md border border-gray-200 p-2 z-10">
          <p className="text-xs text-gray-700 mb-2">Delete this game?</p>
          <div className="flex gap-2">
            <button
              onClick={handleCancelDelete}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-white transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="p-2 border-t">
        <div className="flex flex-wrap gap-2">
          {/* Start/Stop Game Button */}
          <Button
            className={`flex-1 min-w-[120px] text-sm font-medium transition-colors ${
              isActive
                ? "bg-yellow-600 hover:bg-red-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
            onClick={() => {
              if (isActive) {
                onStopSession?.(game.id!);
                localStorage.removeItem(`position-${game.id}`);
                setPosition(0);
                setQuizStarted(false);
              } else {
                onStartSession?.(game.id!);
              }
            }}
            onMouseEnter={() => isActive && setHovered(true)}
            onMouseLeave={() => isActive && setHovered(false)}
          >
            {isActive ? (hovered ? "Stop Game" : "In Progress") : "Start Game"}
          </Button>

          {/* Advance Question Button */}
          {isActive && (
            <Button
              className="flex-1 min-w-[120px] text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowStartQuizConfirm(true)}
            >
              {!quizStarted
                ? "Start Quiz"
                : `Next Question ${position}/${game.questions.length}`}
            </Button>
          )}

          {/* View Sessions Button */}
          <Button
            variant="outline"
            className="flex-1 min-w-[120px] text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            onClick={() => navigate(`/game/${game.id}/sessions`)}
          >
            View Sessions
          </Button>
        </div>


