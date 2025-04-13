import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface GameCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

/**
 * Modal component for creating a new game.
 * Displays a form to enter a game name, and calls `onCreate` when submitted.
 */
const GameCreateModal = ({ open, onClose, onCreate }: GameCreateModalProps) => {
  const [gameName, setGameName] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles the creation of a new game.
   * Calls the `onCreate` callback with the provided name.
   */
  const handleSubmit = async () => {
    try {
      await onCreate(gameName);
      setGameName("");
      setError("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    }
  };

  // Don't render modal if `open` is false
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-[350px] max-w-[90vw]">
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Create New Game</h2>
          <button
            onClick={() => {
              onClose();
              setError("");
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Game Name Input */}
        <div>
          <label htmlFor="game-name" className="text-sm font-medium block mb-2">
            Game Name
          </label>
          <Input
            id="game-name"
            placeholder="Enter game name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <X className="h-4 w-4" />
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </div>
    </div>
  );
};

export default GameCreateModal;
