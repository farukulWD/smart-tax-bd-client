"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreatePaymentMutation } from "@/redux/api/payment/paymentApi";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";

type PaymentFor =
  | "fee_amount"
  | "fee_due_amount"
  | "tax_payable_amount"
  | "remaining_all_amount";

interface PayableAmountCellProps {
  amount: number;
  orderId: string;
  paymentFor: PaymentFor;
  isPaid: boolean;
}

const formatBDT = (amount: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(
    amount
  );

export function PayableAmountCell({
  amount,
  orderId,
  paymentFor,
  isPaid,
}: PayableAmountCellProps) {
  const t = useTranslations("orderPayment");
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const canPay = !isPaid && amount > 0;

  if (!canPay) {
    return (
      <span className="font-medium text-muted-foreground">
        {formatBDT(amount)}
      </span>
    );
  }

  const handlePay = async () => {
    try {
      const res = await createPayment({ orderId, paymentFor }).unwrap();
      // An earlier payment for this amount turned out to have gone through.
      if (res?.data?.paid) {
        toast.success(t("previousPaymentConfirmed"));
        return;
      }
      const gatewayUrl = res?.data?.gatewayPageURL;
      if (!gatewayUrl) {
        toast.error(t("paymentLinkNotFound"));
        return;
      }
      window.location.href = gatewayUrl;
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        t("paymentInitFailed");
      toast.error(message);
      globalErrorHandler(error);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={isLoading}
      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 flex items-center gap-1 disabled:opacity-60"
    >
      {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
      {formatBDT(amount)}
    </button>
  );
}
