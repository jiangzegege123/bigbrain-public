import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/api/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AtSign, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const data = await adminLogin(email, password);
      login(data.token, email);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    }
  };

  if (isLoggedIn) return <Navigate to="/dashboard" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Enter your credentials to access your account
          </p>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-4 mb-10">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <AtSign className="h-4 w-4" />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full py-6 text-base font-medium transition-all hover:shadow-md group"
            >
              Login
              <LogIn className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="text-center text-sm text-gray-500">
              {"Don't have an account? "}
              <Link
                to="/register"
                className="text-gray-900 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
