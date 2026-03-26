"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleX, AlertTriangle, Loader2 } from "lucide-react";
import { usePaymentSuccessMutation } from "@/redux/api/payment/paymentApi";
import { useEffect } from "react";

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

const PaymentStatusView = ({
  status,
  title,
  description,
}: PaymentStatusViewProps) => {
  const Icon = iconMap[status];
  const iconClassName = iconClassMap[status];
  const params = useSearchParams();
  const transactionId =
    params.get("tran_id") ||
    params.get("transaction_id") ||
    params.get("val_id");
  const paymentFor = params.get("paymentFor") || undefined;

  const [paymentSuccess, { isLoading }] = usePaymentSuccessMutation();

  useEffect(() => {
    if (status === "success" && transactionId && !isLoading) {
      paymentSuccess({ tran_id: transactionId, paymentFor });
    }
  }, [transactionId, paymentSuccess, status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-slate-400 mb-4" />
          <h1 className="text-xl font-semibold text-slate-700">
            Verifying Payment...
          </h1>
          <p className="mt-2 text-slate-500">
            Please wait while we confirm your transaction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Icon className={`mx-auto mb-4 h-14 w-14 ${iconClassName}`} />
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>

        {transactionId ? (
          <p className="mt-4 text-sm text-slate-500">
            Transaction ID:{" "}
            <span className="font-semibold">{transactionId}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/profile/orders">
            <Button className="w-full sm:w-auto">Go To Orders</Button>
          </Link>
          <Link href="/profile/payments">
            <Button variant="outline" className="w-full sm:w-auto">
              View Payments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusView;
