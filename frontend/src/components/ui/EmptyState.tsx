import { Button } from "@/components/ui/button";
import { PlusCircle, Gamepad2 } from "lucide-react";

interface EmptyStateProps {
  onCreate: () => void;
}

const EmptyState = ({ onCreate }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm mt-10">
      <Gamepad2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        No games found
      </h2>
      <p className="text-gray-500 mb-6">
        Create your first game to get started
      </p>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create Game
      </Button>
    </div>
  );
};

export default EmptyState;
