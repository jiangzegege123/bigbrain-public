import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/game/:gameId" element={<p>Game Edit Page</p>} />
      <Route
        path="/game/:gameId/question/:questionId"
        element={<p>Question Edit Page</p>}
      />
      <Route path="/session/:sessionId" element={<p>Session Control Page</p>} />
      <Route path="/play/:sessionId" element={<p>Player Game Page</p>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
