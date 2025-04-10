"use client";

import type React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, HelpCircle, Gamepad2, X } from "lucide-react";
import type { Game, Question } from "@/types/index";
import { Button } from "../ui/button";

interface GameCardProps {
  game: Game;
  onDelete: (id: number) => void;
  onStartSession: (id: number) => void;
  onStopSession: (id: number) => void;
}

const GameCard = ({
  game,
  onDelete,
  onStartSession,
  onStopSession,
}: GameCardProps) => {
  const isActive = game.active != null;

  const [showConfirm, setShowConfirm] = useState(false);
  const totalDuration = game.questions.reduce(
    (sum: number, q: Question) => sum + q.duration,
    0
  );

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(game.id!);
    setShowConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  const [hovered, setHovered] = useState(false);

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

      {/* Delete button */}
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
      <div className="p-2 border-t flex justify-between">
        <Button
          className={`relative ${
            isActive ? "bg-yellow-600 hover:bg-red-600" : ""
          }`}
          onClick={() =>
            isActive ? onStopSession?.(game.id) : onStartSession?.(game.id)
          }
          onMouseEnter={() => isActive && setHovered(true)}
          onMouseLeave={() => isActive && setHovered(false)}
        >
          {isActive ? (hovered ? "Stop Game" : "In Progress") : "Start Game"}
        </Button>
      </div>
    </div>
  );
};

export default GameCard;
