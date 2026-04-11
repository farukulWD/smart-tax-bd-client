"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/redux/api/order/orderApi";
import { Eye } from "lucide-react";

interface OrderActionsProps {
  order: IOrder;
}

export function OrderActions({ order }: OrderActionsProps) {
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
            <DialogDescription>
              Tax order details and step status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Name:</span>{" "}
              <span className="font-medium">
                {order.personal_information?.name || "N/A"}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              <span className="font-medium">
                {order.personal_information?.email || "N/A"}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span>{" "}
              <span className="font-medium">
                {order.personal_information?.phone || "N/A"}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Tax Year:</span>{" "}
              <span className="font-medium">{order.tax_year || "N/A"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Current Step:</span>{" "}
              <span className="font-medium">{order.current_step || "N/A"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Fee Due:</span>{" "}
              <span className="font-medium">
                {new Intl.NumberFormat("en-BD", {
                  style: "currency",
                  currency: "BDT",
                }).format(Number(order.fee_due_amount || 0))}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {(order.source_of_income || []).length ? (
                order.source_of_income.map((type, index) => (
                  <Badge key={`${type}-${index}`} variant="outline">
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">No income sources</span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
