import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import GameEdit from "./pages/GameEdit";
import QuestionEdit from "@/pages/QuestionEdit";
import SessionResults from "./pages/SessionResults";
import Play from "./pages/Play";
import PlayerGame from "./pages/PlayerGame";
import GameSessions from "./pages/GameSessions";
import AdminSessionResult from "./pages/AdminSessionResult";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/game/:gameId" element={<GameEdit />} />
      <Route path="/game/:gameId/question/new" element={<QuestionEdit />} />
      <Route path="/game/:gameId/sessions" element={<GameSessions />} />

      <Route
        path="/game/:gameId/question/:questionId"
        element={<QuestionEdit />}
      />

      <Route
        path="/:gameId/session/:sessionId"
        element={<AdminSessionResult />}
      />
      <Route path="/play" element={<Play />} />
      <Route path="/play/:sessionId" element={<Play />} />
      <Route path="/play/:sessionId/:playerId" element={<PlayerGame />} />
      <Route
        path="/play/:sessionId/:playerId/Result"
        element={<SessionResults />}
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
