"use client";

import {
  useGetTaxOrderByIdQuery,
  useInitTaxStepThreePaymentMutation,
} from "@/redux/api/order/orderApi";
import { Loader2, CheckCircle2, CircleAlert } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { globalErrorHandler } from "@/helpers/globalErrorHandler";
import Link from "next/link";

const OrderPaymentComponent = ({ taxId }: { taxId: string }) => {
  const { data, isLoading, isError, refetch } = useGetTaxOrderByIdQuery(
    taxId || skipToken,
  );
  const [initTaxStepThreePayment, { isLoading: isStartingPayment }] =
    useInitTaxStepThreePaymentMutation();

  if (!taxId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">No order selected.</p>
        <Link href="/profile/orders/create">
          <Button>Create Order</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data?.tax_order) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">
          Failed to load order payment status.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const order = data.data.tax_order;
  const isPaid =
    Number(order.fee_due_amount || 0) <= 0 || order.status === "order_placed";

  const handleStartPayment = async () => {
    if (!taxId) return;
    try {
      const res = await initTaxStepThreePayment(taxId).unwrap();
      const gatewayUrl = res?.data?.gatewayPageURL;
      if (!gatewayUrl) {
        toast.error("Payment link was not found");
        return;
      }
      window.location.href = gatewayUrl;
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Payment initialization failed";
      toast.error(message);
      globalErrorHandler(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Step 3: Payment</h1>
        <p className="text-muted-foreground">
          Complete payment to place your tax order.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Payment Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Order Status</span>
            <Badge>{order.status}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Step</span>
            <span className="font-semibold">{order.current_step}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fee Due</span>
            <span className="font-semibold">
              {new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
              }).format(Number(order.fee_due_amount || 0))}
            </span>
          </div>

          {isPaid ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                Payment successful. Order placed.
              </span>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-center gap-2 text-amber-700">
              <CircleAlert className="h-5 w-5" />
              <span className="text-sm font-medium">Payment pending.</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleStartPayment}
              disabled={isStartingPayment || isPaid}
            >
              {isStartingPayment && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Start Payment
            </Button>
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Refresh Status
            </Button>
            <Link href={`/profile/orders?taxId=${taxId}`}>
              <Button type="button" variant="ghost">
                Back to Step 2
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPaymentComponent;
