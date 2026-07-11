"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  isPaid,
}: PayableAmountCellProps) {
  const t = useTranslations("orderPayment");
  const [isOpen, setIsOpen] = useState(false);

  const canPay = !isPaid && amount > 0;

  if (!canPay) {
    return (
      <span className="font-medium text-muted-foreground">
        {formatBDT(amount)}
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 flex items-center gap-1"
      >
        {formatBDT(amount)}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("contactModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("payableModalDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setIsOpen(false)}>
              {t("okay")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
