"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/redux/api/order/orderApi";
import { format } from "date-fns";
import { OrderActions } from "./order-actions";

const statusVariant = (status: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "completed") return "default";
  if (normalized === "pending") return "secondary";
  if (normalized === "cancelled") return "destructive";
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
    accessorKey: "payable_amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("payable_amount") || 0);
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
      const status = (row.getValue("status") as string) || "pending";
      return (
        <Badge variant={statusVariant(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: "Payment",
    cell: ({ row }) => {
      const isPaid = Boolean(row.getValue("isPaid"));
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
