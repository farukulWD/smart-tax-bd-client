"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreatePaymentMutation } from "@/redux/api/payment/paymentApi";

type PaymentFor =
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
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const canPay = !isPaid && amount > 0;

  const handlePay = async () => {
    if (!canPay || !orderId) return;
    try {
      const res = await createPayment({ orderId, paymentFor }).unwrap();
      const gatewayUrl = res?.data?.gatewayPageURL;
      if (res?.success && gatewayUrl) {
        window.location.href = gatewayUrl;
        return;
      }
      toast.error("Payment link was not found");
    } catch {
      toast.error("Failed to initialize payment.");
    }
  };

  if (!canPay) {
    return (
      <span className="font-medium text-muted-foreground">
        {formatBDT(amount)}
      </span>
    );
  }

  return (
    <button
      onClick={handlePay}
      disabled={isLoading}
      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
      {formatBDT(amount)}
    </button>
  );
}
