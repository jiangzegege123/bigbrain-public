import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import EditGamePage from "./pages/EditGamePage";
import QuestionEditPage from "@/pages/QuestionEditPage";
import PlayerSessionResultPage from "./pages/PlayerSessionResultPage";
import JoinPage from "./pages/JoinPage";
import GamingPage from "./pages/GamingPage";
import PastGameSessions from "./pages/PastGameSessions";
import AdminSessionResultPage from "./pages/AdminSessionResultPage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      <Route path="/game/:gameId" element={<EditGamePage />} />
      <Route path="/game/:gameId/question/new" element={<QuestionEditPage />} />
      <Route path="/game/:gameId/sessions" element={<PastGameSessions />} />

      <Route
        path="/game/:gameId/question/:questionId"
        element={<QuestionEditPage />}
      />

      <Route
        path="/:gameId/session/:sessionId"
        element={<AdminSessionResultPage />}
      />
      <Route path="/play" element={<JoinPage />} />
      <Route path="/play/:sessionId" element={<JoinPage />} />
      <Route path="/play/:sessionId/:playerId" element={<GamingPage />} />
      <Route
        path="/play/:sessionId/:playerId/Result"
        element={<PlayerSessionResultPage />}
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
