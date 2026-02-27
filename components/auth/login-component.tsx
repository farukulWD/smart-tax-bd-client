"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation } from "@/redux/api/auth/authApi";
import { toast } from "sonner";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const destinationUrl = searchParams.get("redirect") || "/profile";

  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();
      if (res) {
        toast.success(res?.message || "Login successful");
        Cookies.set("accessToken", res?.data?.accessToken);
        form.reset();
        router.push(destinationUrl);
      }
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full">
      <p className="text-slate-600 mb-6 font-medium">
        Hassle-free tax season starts here
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email Address *"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#28a745] focus-visible:ring-offset-0 focus:bg-white transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password *"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#28a745] focus-visible:ring-offset-0 focus:bg-white transition-all pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#28a745] hover:bg-[#1f7a33] text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-4 text-base"
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      {/* Footer Links */}
      <p className="text-center text-xs text-slate-600 mb-4">
        By clicking Sign In, you accept the{" "}
        <Link
          href="/terms"
          className="text-[#28a745] hover:underline font-semibold"
        >
          Terms of service
        </Link>
      </p>

      <p className="text-center text-sm text-slate-700 mb-4">
        New to SmartTax?{" "}
        <Link
          href="/register"
          className="text-[#28a745] hover:underline font-semibold"
        >
          Create Account
        </Link>
      </p>

      <p className="text-center mb-6">
        <Link
          href="/forgot-password"
          className="text-[#28a745] hover:underline text-sm font-semibold"
        >
          Forgot Password?
        </Link>
      </p>
    </div>
  );
};

export default LoginComponent;
