import { Navigate, Route, Routes } from "react-router";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
