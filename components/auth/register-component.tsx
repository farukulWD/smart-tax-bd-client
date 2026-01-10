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

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log("Register data:", data);
    // TODO: Implement actual registration logic
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full">
      <p className="text-slate-600 mb-6 font-medium">
        Create your account to get started
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Full Name *"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password *"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#28a745] focus-visible:ring-offset-0 focus:bg-white transition-all pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
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

          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="terms"
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
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="text-[#28a745] hover:underline font-semibold"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-[#28a745] hover:underline font-semibold"
                    >
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Sign Up Button */}
          <Button
            type="submit"
            className="w-full bg-[#28a745] hover:bg-[#1f7a33] text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-4 text-base"
          >
            Create Account
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-slate-700 mb-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#28a745] hover:underline font-semibold"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterComponent;
