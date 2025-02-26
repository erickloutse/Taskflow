import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">
            {errors.email.message as string}
          </p>
        )}
      </div>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
        {errors.password && (
          <p className="text-sm text-destructive mt-1">
            {errors.password.message as string}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
