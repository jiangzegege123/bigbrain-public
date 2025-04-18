import { XCircle } from "lucide-react";

const SessionOverView = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <XCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-red-600">
          This session does not exist or has already ended.
        </h2>
        <p className="text-muted-foreground">
          Please check the link or ask the host to restart the game.
        </p>
      </div>
    </div>
  );
};

export default SessionOverView;
