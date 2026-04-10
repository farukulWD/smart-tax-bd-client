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
import { useVerifyForgotOtpMutation, useForgotPasswordMutation } from "@/redux/api/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";

const otpSchema = z.object({
  otp: z.string().min(6, { message: "Your one-time password must be 6 characters." }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const OTPVerificationComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") ?? "";

  const [verifyForgotOtp, { isLoading }] = useVerifyForgotOtpMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: OTPFormValues) => {
    try {
      const res = await verifyForgotOtp({ mobile, otp: data.otp }).unwrap();
      toast.success("OTP verified successfully");
      router.push(`/reset-password?resetToken=${encodeURIComponent(res.data.resetToken)}`);
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  const handleResend = async () => {
    if (!mobile) return;
    try {
      await forgotPassword({ mobile }).unwrap();
      toast.success("OTP resent to your mobile number");
      form.reset();
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full">
      <p className="text-slate-600 mb-1 font-medium text-center">
        Enter the 6-digit code sent to
      </p>
      <p className="text-green-600 font-semibold text-center mb-6">{mobile}</p>

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
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 text-base"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-slate-700">
        Didn&apos;t receive code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-green-600 hover:underline font-semibold bg-transparent border-none cursor-pointer p-0 disabled:opacity-50"
        >
          {isResending ? "Resending..." : "Resend"}
        </button>
      </p>
    </div>
  );
};

export default OTPVerificationComponent;
