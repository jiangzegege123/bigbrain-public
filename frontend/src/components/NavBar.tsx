import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Brain } from "lucide-react";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <header className="w-full bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="flex items-center gap-2 text-xl font-bold cursor-pointer"
          onClick={handleLogoClick}
        >
          <Brain className="h-6 w-6 text-gray-800" />
          <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            BigBrain
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
