import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Answer } from "@/hooks/useSessionData";
interface PlayerSummaryCardProps {
  playerScore: number;
  correctCount: number;
  totalQuestions: number;
  title?: string;
}
export const PlayerSummaryCard = ({
  playerScore,
  correctCount,
  totalQuestions,
  title = "Your Session Performance",
}: PlayerSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
            <span className="text-3xl font-bold">{playerScore}</span>
            <span className="text-sm text-muted-foreground">Total Score</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
            <span className="text-3xl font-bold">
              {correctCount} / {totalQuestions}
            </span>
            <span className="text-sm text-muted-foreground">
              Correct Answers
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
interface PlayerPerformanceSummaryProps {
  playerScore: number;
  correctCount: number;
  totalQuestions: number;
  totalPlayers: number;
  title?: string;
}
export const PlayerPerformanceSummary = ({
  playerScore,
  correctCount,
  totalQuestions,
  totalPlayers,
  title = "Performance Summary",
}: PlayerPerformanceSummaryProps) => {
  const correctPercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {totalQuestions > 0 ? (
            <p className="text-lg">
              You scored <span className="font-bold">{playerScore}</span> points
              by answering <span className="font-bold">{correctCount}</span> out
              of <span className="font-bold">{totalQuestions}</span> questions
              correctly (<span className="font-bold">{correctPercentage}%</span>
              ).
            </p>
          ) : (
            <p className="text-lg">No question data available.</p>
          )}
          {totalPlayers > 0 && (
            <p className="text-lg">
              There were <span className="font-bold">{totalPlayers}</span>{" "}
              players in this session.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
interface QuestionPerformanceTableProps {
  answers: Answer[];
  questionPoints: number[];
  questionTexts: string[];
  title?: string;
}
export const QuestionPerformanceTable = ({
  answers,
  questionPoints,
  questionTexts,
  title = "Question Performance",
}: QuestionPerformanceTableProps) => {
  const totalQuestions = answers.length;
  if (totalQuestions === 0) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left font-medium">Question</th>
                <th className="p-2 text-left font-medium">Result</th>
                <th className="p-2 text-left font-medium">Points</th>
                <th className="p-2 text-left font-medium">Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((answer, idx) => {
                const responseTime =
                  answer.questionStartedAt && answer.answeredAt
                    ? +(
                        (new Date(answer.answeredAt).getTime() -
                          new Date(answer.questionStartedAt).getTime()) /
                        1000
                      ).toFixed(2)
                    : 0;
                const questionText =
                  questionTexts[idx] || `Question ${idx + 1}`;

                return (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{questionText}</td>
                    <td className="p-2">
                      <span
                        className={
                          answer.correct ? "text-green-600" : "text-red-600"
                        }
                      >
                        {answer.correct ? "Correct" : "Incorrect"}
                      </span>
                    </td>
                    <td className="p-2">
                      {answer.correct ? questionPoints[idx] || 0 : 0}
                    </td>
                    <td className="p-2">{responseTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

interface TopPlayersTableProps {
  players: { name: string; score: number; correctCount: number }[];
  title?: string;
}

export const TopPlayersTable = ({
  players,
  title = "Top Players",
}: TopPlayersTableProps) => {
  if (!players.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left font-medium">Name</th>
                <th className="p-2 text-left font-medium">Score</th>
                <th className="p-2 text-left font-medium">Correct Answers</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{player.name}</td>
                  <td className="p-2">{player.score}</td>
                  <td className="p-2">{player.correctCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
