"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/redux/api/order/orderApi";
import { format } from "date-fns";
import { OrderActions } from "./order-actions";
import { PayableAmountCell } from "./payable-amount-cell";

const statusVariant = (status: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "order_placed" || normalized === "completed")
    return "default";
  if (normalized === "draft" || normalized === "in_progress")
    return "secondary";
  if (normalized === "cancelled" || normalized === "rejected")
    return "destructive";
  return "outline";
};

export const columns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.getValue("_id") as string;
      return (
        <span className="font-medium">#{id?.slice(-6).toUpperCase()}</span>
      );
    },
  },
  {
    accessorKey: "tax_year",
    header: "Tax Year",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "draft";
      return (
        <Badge className="capitalize" variant={statusVariant(status)}>
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <span>{createdAt ? format(new Date(createdAt), "PPP") : "N/A"}</span>
      );
    },
  },
  {
    accessorKey: "fee_due_amount",
    header: "Fee Due",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <PayableAmountCell
          amount={Number(order.fee_due_amount || 0)}
          orderId={order._id!}
          paymentFor="fee_due_amount"
          isPaid={order.is_fee_due_amount_paid}
        />
      );
    },
  },
  {
    accessorKey: "tax_payable_amount",
    header: "Tax Payable Amount",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <PayableAmountCell
          amount={Number(order.tax_payable_amount || 0)}
          orderId={order._id!}
          paymentFor="tax_payable_amount"
          isPaid={order.is_tax_payable_amount_paid}
        />
      );
    },
  },
  {
    id: "totalPayableAmount",
    header: "Total Payable Amount",
    cell: ({ row }) => {
      const order = row.original;
      const unpaidTax = order.is_tax_payable_amount_paid
        ? 0
        : Number(order.tax_payable_amount || 0);
      const unpaidFee = order.is_fee_due_amount_paid
        ? 0
        : Number(order.fee_due_amount || 0);
      const totalAmount = unpaidTax + unpaidFee;
      const isPaid = totalAmount === 0;
      return (
        <PayableAmountCell
          amount={totalAmount}
          orderId={order._id!}
          paymentFor="remaining_all_amount"
          isPaid={isPaid}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
];
