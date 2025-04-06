import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-8 rounded w-96 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button className="w-full">Login</Button>
      </div>
    </div>
  );
}
