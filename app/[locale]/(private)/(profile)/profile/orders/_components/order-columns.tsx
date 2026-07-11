"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/redux/api/order/orderApi";
import { format } from "date-fns";
import { OrderActions } from "./order-actions";
import { PayableAmountCell } from "./payable-amount-cell";
import Link from "next/link";

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
    id: "files",
    header: "Files",
    cell: ({ row }) => {
      const order = row.original;
      if (!order.files_upload_pending) return null;
      return (
        <Link href={`/profile/orders/create/${order._id}`}>
          <Badge
            variant="outline"
            className="border-amber-400 bg-amber-50 text-amber-700 cursor-pointer hover:bg-amber-100"
          >
            Upload Pending
          </Badge>
        </Link>
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
    id: "serviceFee",
    header: "Service Fee",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <PayableAmountCell
          amount={Number(order.fee_amount || 0)}
          orderId={order._id!}
          paymentFor="fee_amount"
          isPaid={order.is_fee_amount_paid}
        />
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
      const unpaidServiceFee = order.is_fee_amount_paid
        ? 0
        : Number(order.fee_amount || 0);
      const unpaidTax = order.is_tax_payable_amount_paid
        ? 0
        : Number(order.tax_payable_amount || 0);
      const unpaidFee = order.is_fee_due_amount_paid
        ? 0
        : Number(order.fee_due_amount || 0);
      const totalAmount = unpaidServiceFee + unpaidTax + unpaidFee;
      return (
        <span className="font-medium text-muted-foreground">
          {new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
          }).format(totalAmount)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
];
