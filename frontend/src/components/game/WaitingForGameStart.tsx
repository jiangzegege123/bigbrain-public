import { useState, useEffect } from "react";
import { Loader2, Lightbulb, BookOpen } from "lucide-react";

const funFacts = [
  "The first computer mouse was made of wood 🪚",
  "The first computer virus was created in 1983 🦠",
  "The first video game was created in 1958 🎮",
  "The QWERTY keyboard was designed to slow typing down ⌨️",
  "The first computer programmer was Ada Lovelace 👩‍💻",
  "The first computer bug was an actual bug 🐛",
  "The first tweet was sent in 2006 🐦",
  "The first YouTube video was uploaded in 2005 📺",
];

const gameTips = [
  "Read each question carefully before answering",
  "For multiple choice questions, you can select more than one answer",
  "You can't change your answer after the timer runs out",
  "Points are awarded based on how quickly you answer correctly",
  "Stay focused and don't get distracted",
];

const WaitingForGameStart = () => {
  const [currentFact, setCurrentFact] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  // Rotate through facts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Rotate through tips every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % gameTips.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-8">
      {/* Main waiting indicator */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 animate-ping rounded-full" />
        <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">
          Waiting for the game to start...
        </h2>
        <p className="text-lg text-muted-foreground">
          Get ready! The quiz will begin soon.
        </p>
      </div>

      {/* Fun facts section */}
      <div className="max-w-md bg-blue-50 p-4 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-medium">
          <Lightbulb className="h-5 w-5" />
          <span>Did you know?</span>
        </div>
        <p className="text-blue-600 animate-fade-in">{funFacts[currentFact]}</p>
      </div>

      {/* Game tips section */}
      <div className="max-w-md bg-amber-50 p-4 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-amber-700 font-medium">
          <BookOpen className="h-5 w-5" />
          <span>Game Tip</span>
        </div>
        <p className="text-amber-600 animate-fade-in">{gameTips[currentTip]}</p>
      </div>
    </div>
  );
};

export default WaitingForGameStart;
