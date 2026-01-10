"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Login data:", data);
    // TODO: Implement actual login logic
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

          {/* Remember Me */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0 mb-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-slate-300 data-[state=checked]:bg-[#28a745] data-[state=checked]:border-[#28a745]"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-slate-600 font-normal">
                    Remember me
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full bg-[#28a745] hover:bg-[#1f7a33] text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-4 text-base"
          >
            Sign In
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
