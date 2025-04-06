import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AtSign, User, Lock, KeyRound, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Enter your information to create an account
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="email">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <AtSign className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 transition-all focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="name">
              Name
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="pl-10 transition-all focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 transition-all focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                className="pl-10 transition-all focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full py-6 text-base font-medium transition-all hover:shadow-md group">
            Register
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-900 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
