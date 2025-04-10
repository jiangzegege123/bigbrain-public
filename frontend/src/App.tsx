import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import GameEdit from "./pages/GameEdit";
import QuestionEdit from "@/pages/QuestionEdit";
import SessionResults from "./pages/SessionResults";
import Play from "./pages/Play";
import PlayJoin from "./pages/PlayJoin";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/game/:gameId" element={<GameEdit />} />
      <Route path="/game/:gameId/question/new" element={<QuestionEdit />} />

      <Route
        path="/game/:gameId/question/:questionId"
        element={<QuestionEdit />}
      />

      <Route path="/session/:sessionId" element={<SessionResults />} />
      <Route path="/play" element={<Play />} />
      <Route path="/play/:sessionId" element={<PlayJoin />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
