"use client";

import { useEffect, useState } from "react";
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
import {
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
} from "@/redux/api/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";
import { useTranslations } from "next-intl";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters." }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

// OTP is valid for 5 minutes; a new one can only be requested after it expires.
const RESEND_COOLDOWN_SECONDS = 5 * 60;

const RegisterVerifyComponent = () => {
  const t = useTranslations("auth.otpVerification");
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") ?? "";

  const [verifyRegisterOtp, { isLoading }] = useVerifyRegisterOtpMutation();
  const [resendRegisterOtp, { isLoading: isResending }] =
    useResendRegisterOtpMutation();

  // Countdown until the next resend is allowed (server enforces the same window).
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatCountdown = (total: number) => {
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: OTPFormValues) => {
    try {
      await verifyRegisterOtp({ mobile, otp: data.otp }).unwrap();
      toast.success(t("verifiedSuccess"));
      router.push("/login");
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  const handleResend = async () => {
    if (!mobile || secondsLeft > 0) return;
    try {
      await resendRegisterOtp({ mobile }).unwrap();
      toast.success(t("otpResent"));
      form.reset();
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full">
      <p className="text-slate-600 mb-1 font-medium text-center">
        {t("registerTagline")}
      </p>
      <p className="text-red-600 font-semibold text-center mb-6">{mobile}</p>

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
            className="w-full bg-red-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 text-base"
          >
            {isLoading ? t("verifying") : t("verifyOtp")}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-slate-700">
        {t("didntReceive")}{" "}
        {secondsLeft > 0 ? (
          <span className="text-slate-500 font-semibold">
            {t("resendIn", { time: formatCountdown(secondsLeft) })}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-red-600 hover:underline font-semibold bg-transparent border-none cursor-pointer p-0 disabled:opacity-50"
          >
            {isResending ? t("resending") : t("resend")}
          </button>
        )}
      </p>
    </div>
  );
};

export default RegisterVerifyComponent;
