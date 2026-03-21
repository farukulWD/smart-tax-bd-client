"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/redux/api/order/orderApi";
import { format } from "date-fns";
import { OrderActions } from "./order-actions";

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
      const amount = Number(row.getValue("fee_due_amount") || 0);
      return (
        <span className="font-medium">
          {new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
          }).format(amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "tax_payable_amount",
    header: "Tax Payable Amount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("tax_payable_amount") || 0);
      return (
        <span className="font-medium">
          {new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
          }).format(amount)}
        </span>
      );
    },
  },
  {
    id: "totalPayableAmount",
    header: "Total Payable Amount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("tax_payable_amount") || 0);
      const feeAmount = Number(row.getValue("fee_due_amount") || 0);
      const totalAmount = amount + feeAmount;
      return (
        <span className="font-medium">
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
