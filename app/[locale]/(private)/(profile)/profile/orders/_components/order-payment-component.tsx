"use client";

import {
  useGetTaxOrderByIdQuery,
  // useInitTaxStepThreePaymentMutation, // TEMPORARY: re-enable for SSLCommerz gateway
  usePlaceTaxOrderManuallyMutation,
} from "@/redux/api/order/orderApi";
import {
  useApplyCouponMutation,
  useRemoveCouponMutation,
} from "@/redux/api/coupon/couponApi";
import { Loader2, CheckCircle2, CircleAlert, TicketPercent, X } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { getAppliedCoupon, getPayableFeeAmount } from "@/lib/order-amounts";

const formatBDT = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
  }).format(amount);

const OrderPaymentComponent = ({ taxId }: { taxId: string }) => {
  const t = useTranslations("orderPayment");
  const { data, isLoading, isError, refetch } = useGetTaxOrderByIdQuery(
    taxId || skipToken,
  );
  const [placeTaxOrderManually, { isLoading: isPlacing }] =
    usePlaceTaxOrderManuallyMutation();
  const [applyCoupon, { isLoading: isApplyingCoupon }] =
    useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemovingCoupon }] =
    useRemoveCouponMutation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");

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
  const appliedCoupon = getAppliedCoupon(order.applied_coupon);
  const subtotal = Number(order.fee_amount || 0);
  const discount = Number(appliedCoupon?.discount_amount || 0);
  const payableFee = getPayableFeeAmount(order);

  // Paid once the service fee is settled — either the flag is set (cash/gateway),
  // the order has advanced past payment, or there is nothing left to collect
  // (a coupon can cover the fee in full).
  const isPaid =
    payableFee <= 0 ||
    order.is_fee_amount_paid ||
    order.status === "order_placed" ||
    order.status === "completed";

  const isCouponBusy = isApplyingCoupon || isRemovingCoupon;

  // TEMPORARY: bKash is handled manually for now. The SSLCommerz gateway flow
  // below is kept (commented) so it can be restored later — just swap the
  // payment button onClick back to `handleStartPayment`.
  // const handleStartPayment = async () => {
  // if (!taxId) return;
  // try {
  //   const res = await initTaxStepThreePayment(taxId).unwrap();
  //   // A coupon covering the whole fee settles the order server-side and
  //   // returns no gateway URL — nothing to redirect to.
  //   if (res?.data?.paid) {
  //     toast.success(t("couponCoveredFee"));
  //     refetch();
  //     return;
  //   }
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

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    try {
      await applyCoupon({ taxId, code }).unwrap();
      setCouponInput("");
      toast.success(t("couponApplied"));
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        t("couponApplyFailed");
      toast.error(message);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon(taxId).unwrap();
      toast.success(t("couponRemoved"));
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        t("couponRemoveFailed");
      toast.error(message);
    }
  };

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

          {!isPaid && (
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <TicketPercent className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">
                      {appliedCoupon.code}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-emerald-700 hover:bg-emerald-100"
                    onClick={handleRemoveCoupon}
                    disabled={isCouponBusy}
                  >
                    {isRemovingCoupon ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span className="ml-1">{t("removeCoupon")}</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    placeholder={t("couponPlaceholder")}
                    className="uppercase sm:max-w-56"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    disabled={isCouponBusy}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isCouponBusy || !couponInput.trim()}
                  >
                    {isApplyingCoupon && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {t("applyCoupon")}
                  </Button>
                </div>
              )}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span className="font-medium">{formatBDT(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("discount")}
                  {appliedCoupon?.code ? ` (${appliedCoupon.code})` : ""}
                </span>
                <span className="font-medium text-emerald-600">
                  −{formatBDT(discount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-base">
              <span className="font-medium">{t("total")}</span>
              <span className="font-bold">{formatBDT(payableFee)}</span>
            </div>
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
