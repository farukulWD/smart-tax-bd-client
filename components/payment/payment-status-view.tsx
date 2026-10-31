"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleX, AlertTriangle, Loader2 } from "lucide-react";
import {
  usePaymentClosedMutation,
  usePaymentSuccessMutation,
} from "@/redux/api/payment/paymentApi";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type StatusType = "success" | "failed" | "cancelled";

interface PaymentStatusViewProps {
  status: StatusType;
  title: string;
  description: string;
}

const iconMap = {
  success: CheckCircle2,
  failed: CircleX,
  cancelled: AlertTriangle,
} as const;

const iconClassMap = {
  success: "text-green-600",
  failed: "text-red-600",
  cancelled: "text-amber-600",
} as const;

const REDIRECT_SECONDS = 5;

const PaymentStatusView = ({
  status,
  title,
  description,
}: PaymentStatusViewProps) => {
  const t = useTranslations("paymentStatus");
  const params = useSearchParams();
  // Read the gateway's return values once: the effect below clears them from
  // the address bar, which also updates `params`.
  const [{ transactionId, paymentFor }] = useState(() => ({
    transactionId: params.get("tran_id"),
    paymentFor: params.get("paymentFor") || undefined,
  }));

  const router = useRouter();
  const [
    paymentSuccess,
    { isLoading, isUninitialized, isSuccess, isError, error },
  ] = usePaymentSuccessMutation();
  const [paymentClosed] = usePaymentClosedMutation();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (!transactionId) return;
    // EPS appends its own fields (status, its transaction ID, message) to the
    // return URL. Drop them so they don't stay in the address bar, history,
    // bookmarks or screenshots. The server never trusts them anyway.
    window.history.replaceState(null, "", window.location.pathname);
    if (status === "success") {
      paymentSuccess({ tran_id: transactionId, paymentFor });
    } else {
      paymentClosed({
        tran_id: transactionId,
        status: status === "failed" ? "fail" : "cancel",
      });
    }
  }, [transactionId, paymentFor, paymentSuccess, paymentClosed, status]);

  // Once the server has confirmed the payment, take the user back to their
  // orders automatically.
  const isConfirmed = status === "success" && isSuccess;
  useEffect(() => {
    if (!isConfirmed) return;
    if (secondsLeft <= 0) {
      router.replace("/profile/orders");
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isConfirmed, secondsLeft, router]);

  // The server confirms the payment with EPS before crediting the order, so a
  // success redirect alone is not proof of payment.
  const isVerifying =
    status === "success" && !!transactionId && (isLoading || isUninitialized);
  const verificationFailed = status === "success" && isError;
  const errorMessage =
    (error as { data?: { message?: string } } | undefined)?.data?.message;

  const shownStatus: StatusType = verificationFailed ? "failed" : status;
  const Icon = iconMap[shownStatus];
  const iconClassName = iconClassMap[shownStatus];
  const shownTitle = verificationFailed ? t("error.title") : title;
  const shownDescription = verificationFailed
    ? errorMessage || t("error.description")
    : description;

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-slate-400 mb-4" />
          <h1 className="text-xl font-semibold text-slate-700">
            {t("verifying")}
          </h1>
          <p className="mt-2 text-slate-500">{t("pleaseWait")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Icon className={`mx-auto mb-4 h-14 w-14 ${iconClassName}`} />
        <h1 className="text-2xl font-bold text-slate-900">{shownTitle}</h1>
        <p className="mt-2 text-slate-600">{shownDescription}</p>

        {isConfirmed ? (
          <p className="mt-4 text-sm text-slate-500">
            {t("redirecting", { seconds: secondsLeft })}
          </p>
        ) : null}

        {transactionId ? (
          <p className="mt-4 text-sm text-slate-500">
            {t("transactionId")}{" "}
            <span className="font-semibold">{transactionId}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/profile/orders">
            <Button className="w-full sm:w-auto">{t("goToOrders")}</Button>
          </Link>
          <Link href="/profile/payments">
            <Button variant="outline" className="w-full sm:w-auto">
              {t("viewPayments")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusView;
