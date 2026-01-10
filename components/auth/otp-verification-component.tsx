"use client";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const OTPVerificationComponent = () => {
  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: OTPFormValues) => {
    console.log("OTP data:", data);
    // TODO: Implement actual OTP verification logic
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full">
      <p className="text-slate-600 mb-6 font-medium text-center">
        Enter the 6-digit code sent to your email
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#28a745] hover:bg-[#1f7a33] text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-4 text-base"
          >
            Verify OTP
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-slate-700 mb-4">
        Didn&apos;t receive code?{" "}
        <button
          type="button"
          onClick={() => console.log("Resend OTP")}
          className="text-[#28a745] hover:underline font-semibold bg-transparent border-none cursor-pointer p-0"
        >
          Resend
        </button>
      </p>
    </div>
  );
};

export default OTPVerificationComponent;
