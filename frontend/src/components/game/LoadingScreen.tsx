import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingScreen;
