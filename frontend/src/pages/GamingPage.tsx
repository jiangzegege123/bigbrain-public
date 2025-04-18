import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useGameState } from "@/hooks/useGameState";
import LoadingScreen from "@/components/game/LoadingScreen";
import SessionOverView from "@/components/game/SessionOverView";
import WaitingForGameStart from "@/components/game/WaitingForGameStart";
import QuestionView from "@/components/game/QuestionView";

const GamingPage = () => {
  const { playerId } = useParams<{ playerId: string; sessionId: string }>();
  const { state, actions, utils } = useGameState(playerId!);

  if (state.sessionOver) {
    return <SessionOverView />;
  }

  if (state.isLoading) {
    return <LoadingScreen message="Connecting to game..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardContent className="p-6 md:p-8">
          {!state.started ? (
            <WaitingForGameStart />
          ) : state.question ? (
            <QuestionView
              question={state.question}
              remainingTime={state.remainingTime}
              selected={state.selected}
              correctAnswers={state.correctAnswers}
              showResult={state.showResult}
              onOptionClick={actions.handleOptionClick}
              getProgressValue={utils.getProgressValue}
              getQuestionTypeLabel={utils.getQuestionTypeLabel}
            />
          ) : (
            <LoadingScreen message="Loading question..." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GamingPage;
