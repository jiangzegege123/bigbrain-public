// components/game/GamesHeader.tsx
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface GamesHeaderProps {
  title: string;
  description: string;
  onAddGame: () => void;
}

export const GamesHeader = ({
  title,
  description,
  onAddGame,
}: GamesHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>
      <Button onClick={onAddGame} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        <span>Add Game</span>
      </Button>
    </div>
  );
};
