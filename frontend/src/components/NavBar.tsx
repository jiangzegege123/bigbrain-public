import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">BigBrain</h1>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}
