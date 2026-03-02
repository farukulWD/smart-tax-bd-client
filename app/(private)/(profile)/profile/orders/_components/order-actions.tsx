"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCreatePaymentMutation } from "@/redux/api/payment/paymentApi";
import { IOrder, useCancelOrderMutation } from "@/redux/api/order/orderApi";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OrderActionsProps {
  order: IOrder;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [createPayment, { isLoading: isPaying }] = useCreatePaymentMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const status = order.status?.toLowerCase() || "pending";
  const isPaid = Boolean(order.isPaid);
  const canCancel = !["cancelled", "completed"].includes(status);

  const handlePay = async () => {
    if (!order._id) return;
    try {
      const res = await createPayment({ orderId: order._id }).unwrap();
      if (res?.success && res.data?.gatewayPageURL) {
        window.location.href = res.data.gatewayPageURL;
        return;
      }
      toast.error("Payment link was not found");
    } catch {
      toast.error("Failed to initialize payment");
    }
  };

  const handleCancel = async () => {
    if (!order._id) return;
    try {
      await cancelOrder(order._id).unwrap();
      toast.success("Order cancelled successfully");
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Order #{order._id?.slice(-6).toUpperCase() || "N/A"}
            </DialogTitle>
            <DialogDescription>Order details and tax information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Mobile:</span>{" "}
              <span className="font-medium">{order.mobile || "N/A"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Tax/VAT No:</span>{" "}
              <span className="font-medium">
                {order.tax_or_vat_number || "N/A"}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Tax Year:</span>{" "}
              <span className="font-medium">{order.tax_year || "N/A"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Amount:</span>{" "}
              <span className="font-medium">
                {new Intl.NumberFormat("en-BD", {
                  style: "currency",
                  currency: "BDT",
                }).format(Number(order.payable_amount || 0))}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {(order.tax_types || []).length ? (
                order.tax_types.map((type, index) => (
                  <Badge key={`${type}-${index}`} variant="outline">
                    {type
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">No tax types</span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant={isPaid ? "secondary" : "default"}
        size="sm"
        onClick={handlePay}
        disabled={isPaid || isPaying || !order._id}
      >
        {isPaying && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPaid ? "Paid" : "Pay"}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={!canCancel || isCancelling || !order._id}
          >
            {isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
            Cancel
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will change the order status to cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} disabled={isCancelling}>
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
