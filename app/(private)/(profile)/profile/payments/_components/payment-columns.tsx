"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IPayment } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<IPayment>[] = [
  {
    accessorKey: "id",
    header: "Payment ID",
    cell: ({ row }) => <span className="font-medium">#{(row.getValue("id") as string)?.slice(-6).toUpperCase()}</span>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "payment_method",
    header: "Method",
    cell: ({ row }) => row.getValue("payment_method") || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "transaction_id",
    header: "Transaction ID",
    cell: ({ row }) => row.getValue("transaction_id") || "N/A",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <span>{date ? format(new Date(date), "PPP") : "N/A"}</span>;
    },
  },
];
