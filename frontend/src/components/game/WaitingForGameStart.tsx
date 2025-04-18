import { Loader2 } from "lucide-react";

const WaitingForGameStart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <h2 className="text-2xl font-semibold text-center">
        Waiting for the game to start...
      </h2>
      <p className="text-muted-foreground text-center">
        Get ready! The quiz will begin soon.
      </p>
    </div>
  );
};

export default WaitingForGameStart;
