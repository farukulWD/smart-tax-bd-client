"use client";

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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/redux/api/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordComponent = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const res = await forgotPassword(data).unwrap();
      toast.success(res?.message || "Password reset successful");
      router.push("/");
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full">
      <p className="text-slate-600 mb-6 font-medium">
        Enter your email to reset your password
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#28a745] hover:bg-[#1f7a33] text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-4 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-slate-700 mb-4">
        Remember your password?{" "}
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

export default ForgotPasswordComponent;
