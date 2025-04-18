import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/charts";
import { Answer } from "@/hooks/useSessionData";

interface PerformanceChartProps {
  answers: Answer[];
  questionPoints: number[];
  questionTexts: string[];
  title?: string;
}

export const PerformanceChart = ({
  answers,
  questionPoints,
  questionTexts,
  title = "Points Earned by Question",
}: PerformanceChartProps) => {
  const totalQuestions = answers.length;

  const performanceData = {
    labels:
      questionTexts.length > 0
        ? questionTexts
        : Array.from({ length: totalQuestions }, (_, i) => `Question ${i + 1}`),
    datasets: [
      {
        label: "Your Performance",
        data: answers.map((answer, index) =>
          answer.correct ? questionPoints[index] || 0 : 0
        ),
        backgroundColor: answers.map((answer) =>
          answer.correct ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)"
        ),
        borderColor: answers.map((answer) =>
          answer.correct ? "rgba(75, 192, 192, 1)" : "rgba(255, 99, 132, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart data={performanceData} />
      </CardContent>
    </Card>
  );
};

interface ResponseTimeChartProps {
  answers: Answer[];
  questionTexts: string[];
  title?: string;
}

export const ResponseTimeChart = ({
  answers,
  questionTexts,
  title = "Response Time by Question",
}: ResponseTimeChartProps) => {
  const totalQuestions = answers.length;

  const timeData = {
    labels:
      questionTexts.length > 0
        ? questionTexts
        : Array.from({ length: totalQuestions }, (_, i) => `Question ${i + 1}`),
    datasets: [
      {
        label: "Response Time (s)",
        data: answers.map((answer) => {
          if (!answer.questionStartedAt || !answer.answeredAt) return 0;
          const start = new Date(answer.questionStartedAt).getTime();
          const end = new Date(answer.answeredAt).getTime();
          return +((end - start) / 1000).toFixed(2);
        }),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart data={timeData} />
      </CardContent>
    </Card>
  );
};

interface CorrectRateChartProps {
  correctRates: number[];
  labels: string[];
  title?: string;
}

export const CorrectRateChart = ({
  correctRates,
  labels,
  title = "Correct Answer Rate",
}: CorrectRateChartProps) => {
  const correctRatesData = {
    labels,
    datasets: [
      {
        label: "Correct Answer Rate (%)",
        data: correctRates,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart data={correctRatesData} />
      </CardContent>
    </Card>
  );
};

interface AvgTimeChartProps {
  avgTimes: number[];
  labels: string[];
  title?: string;
}

export const AvgTimeChart = ({
  avgTimes,
  labels,
  title = "Average Response Time",
}: AvgTimeChartProps) => {
  const avgTimesData = {
    labels,
    datasets: [
      {
        label: "Average Response Time (s)",
        data: avgTimes,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart data={avgTimesData} />
      </CardContent>
    </Card>
  );
};
