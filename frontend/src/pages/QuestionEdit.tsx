import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateQuestion, fetchSingleQuestion } from "@/api/game";
import type { Question } from "@/types";

const QuestionEdit = () => {
  const { token } = useAuth();
  const { gameId, questionId } = useParams();

  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState("");

  // Editable fields
  const [type, setType] = useState("single");
  const [questionText, setQuestionText] = useState("");
  const [duration, setDuration] = useState(30);
  const [points, setPoints] = useState(100);
  const [mediaUrl, setMediaUrl] = useState("");
  const [answers, setAnswers] = useState<string[]>(["", ""]);
  const [correctIndices, setCorrectIndices] = useState<number[]>([]);

  // Load question
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSingleQuestion(token!, gameId!, questionId!);
        setQuestion(data);
        setType(data.type);
        setQuestionText(data.question);
        setDuration(data.duration);
        setPoints(data.points);
        setMediaUrl(data.media || "");
        setAnswers(data.answers || ["", ""]);
        setCorrectIndices(data.correctAnswers || []);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    };
    load();
  }, [token, gameId, questionId]);

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleCorrectToggle = (index: number) => {
    if (correctIndices.includes(index)) {
      setCorrectIndices(correctIndices.filter((i) => i !== index));
    } else {
      setCorrectIndices([...correctIndices, index]);
    }
  };

  const handleSave = async () => {
    try {
      await updateQuestion(token!, gameId!, questionId!, {
        type,
        question: questionText,
        duration,
        points,
        media: mediaUrl,
        answers,
        correctAnswers: correctIndices,
      });
      alert("Question updated successfully.");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  if (!question) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit Question</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        <div>
          <Label>Question Type</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
            <option value="judgement">Judgement</option>
          </select>
        </div>

        <div>
          <Label>Question</Label>
          <Input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>

        <div>
          <Label>Duration (seconds)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Points</Label>
          <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Media (YouTube URL or Image)</Label>
          <Input
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Answers</Label>
          {answers.map((ans, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={ans}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
              />
              <input
                type="checkbox"
                checked={correctIndices.includes(idx)}
                onChange={() => handleCorrectToggle(idx)}
              />
              <span className="text-sm">Correct</span>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={() => setAnswers([...answers, ""])}
            disabled={answers.length >= 6}
          >
            Add Answer
          </Button>

          {answers.length > 2 && (
            <Button
              variant="outline"
              onClick={() => setAnswers(answers.slice(0, -1))}
            >
              Remove Answer
            </Button>
          )}
        </div>

        <Button onClick={handleSave}>Save Question</Button>
      </div>
    </div>
  );
};

export default QuestionEdit;
