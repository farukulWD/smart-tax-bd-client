"use client";

import {
  useGetTaxOrderByIdQuery,
  // useInitTaxStepThreePaymentMutation, // TEMPORARY: re-enable for SSLCommerz gateway
  usePlaceTaxOrderManuallyMutation,
} from "@/redux/api/order/orderApi";
import { Loader2, CheckCircle2, CircleAlert } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

const OrderPaymentComponent = ({ taxId }: { taxId: string }) => {
  const t = useTranslations("orderPayment");
  const { data, isLoading, isError, refetch } = useGetTaxOrderByIdQuery(
    taxId || skipToken,
  );
  const [placeTaxOrderManually, { isLoading: isPlacing }] =
    usePlaceTaxOrderManuallyMutation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // TEMPORARY: SSLCommerz gateway flow disabled while bKash is handled manually.
  // const [initTaxStepThreePayment, { isLoading: isStartingPayment }] =
  //   useInitTaxStepThreePaymentMutation();

  if (!taxId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t("noOrderSelected")}</p>
        <Link href="/profile/orders/create">
          <Button>{t("createOrder")}</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data?.tax_order) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{t("failedToLoad")}</p>
        <Button onClick={() => refetch()}>{t("retry")}</Button>
      </div>
    );
  }

  const order = data.data.tax_order;
  // Paid once the service fee is settled — either the flag is set (cash/gateway),
  // the order has advanced past payment, or there is no fee to collect.
  const isPaid =
    Number(order.fee_amount || 0) <= 0 ||
    order.is_fee_amount_paid ||
    order.status === "order_placed" ||
    order.status === "completed";

  // TEMPORARY: bKash is handled manually for now. The SSLCommerz gateway flow
  // below is kept (commented) so it can be restored later — just swap the
  // payment button onClick back to `handleStartPayment`.
  // const handleStartPayment = async () => {
  // if (!taxId) return;
  // try {
  //   const res = await initTaxStepThreePayment(taxId).unwrap();
  //   const gatewayUrl = res?.data?.gatewayPageURL;
  //   if (!gatewayUrl) {
  //     toast.error("Payment link was not found");
  //     return;
  //   }
  //   window.location.href = gatewayUrl;
  // } catch (error: any) {
  //   const message =
  //     error?.data?.message ||
  //     error?.data?.error ||
  //     error?.message ||
  //     "Payment initialization failed";
  //   toast.error(message);
  //   globalErrorHandler(error);
  // }
  // };

  // TEMPORARY: places the order directly; the author contacts the user for payment.
  const handleConfirmContactPayment = async () => {
    if (!taxId) return;
    try {
      await placeTaxOrderManually(taxId).unwrap();
      setIsContactModalOpen(false);
      toast.success("Order placed. The author will contact you for payment.");
      refetch();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Failed to place order";
      toast.error(message);
      globalErrorHandler(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("cardTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("orderStatus")}</span>
            <Badge>{order.status}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("currentStep")}</span>
            <span className="font-semibold">{order.current_step}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("fee")}</span>
            <span className="font-semibold">
              {new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
              }).format(Number(order.fee_amount || 0))}
            </span>
          </div>

          {isPaid ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                {t("paymentSuccessful")}
              </span>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-center gap-2 text-amber-700">
              <CircleAlert className="h-5 w-5" />
              <span className="text-sm font-medium">{t("paymentPending")}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              disabled={isPlacing || isPaid}
            >
              {isPlacing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("startPayment")}
            </Button>
            <Button type="button" variant="outline" onClick={() => refetch()}>
              {t("refreshStatus")}
            </Button>
            <Link href={`/profile/orders?taxId=${taxId}`}>
              <Button type="button" variant="ghost">
                {t("backToStep2")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("contactModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("contactModalDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsContactModalOpen(false)}
              disabled={isPlacing}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmContactPayment}
              disabled={isPlacing}
            >
              {isPlacing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("okay")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPaymentComponent;
