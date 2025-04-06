import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AtSign, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
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

        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <AtSign className="h-4 w-4" />
              </div>
              <Input
                type="email"
                placeholder="Email"
                className="pl-10 transition-all focus:ring-2 focus:ring-gray-200"
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
                className="pl-10 transition-all focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full py-6 text-base font-medium transition-all hover:shadow-md group">
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
      </Card>
    </div>
  );
}
