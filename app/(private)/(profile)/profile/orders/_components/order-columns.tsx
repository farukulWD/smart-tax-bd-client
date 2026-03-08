"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/redux/api/order/orderApi";
import { format } from "date-fns";
import { OrderActions } from "./order-actions";

const statusVariant = (status: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "order_placed" || normalized === "completed") return "default";
  if (normalized === "draft" || normalized === "in_progress") return "secondary";
  if (normalized === "cancelled" || normalized === "rejected") return "destructive";
  return "outline";
};

export const columns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.getValue("_id") as string;
      return <span className="font-medium">#{id?.slice(-6).toUpperCase()}</span>;
    },
  },
  {
    accessorKey: "tax_year",
    header: "Tax Year",
  },
  {
    accessorKey: "current_step",
    header: "Step",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "draft";
      return (
        <Badge variant={statusVariant(status)}>
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fee_due_amount_paid",
    header: "Payment",
    cell: ({ row }) => {
      const isPaid = Number(row.original.fee_due_amount || 0) <= 0;
      return <Badge variant={isPaid ? "default" : "destructive"}>{isPaid ? "Paid" : "Unpaid"}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <span>{createdAt ? format(new Date(createdAt), "PPP") : "N/A"}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
];
