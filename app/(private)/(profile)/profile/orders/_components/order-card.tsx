import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IOrder } from "@/redux/api/order/orderApi";
import { Calendar, CreditCard, Hash, Phone } from "lucide-react";

interface OrderCardProps {
  order: IOrder & { _id?: string; createdAt?: string };
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPaymentVariant = (isPaid: boolean) => {
    return isPaid ? "default" : "destructive";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Order #{order._id?.slice(-6).toUpperCase() || "N/A"}
            </CardTitle>
            <CardDescription className="mt-1">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={getStatusVariant(order.status)}>
              {order.status}
            </Badge>
            <Badge variant={getPaymentVariant(order.isPaid)}>
              {order.isPaid ? "Paid" : "Unpaid"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Mobile:</span>
            <span className="font-medium">{order.mobile}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tax/VAT:</span>
            <span className="font-medium">{order.tax_or_vat_number}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tax Year:</span>
            <span className="font-medium">{order.tax_year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">৳{order.payable_amount}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Tax Types:</div>
          <div className="flex flex-wrap gap-2">
            {order.tax_types && order.tax_types.length > 0 ? (
              order.tax_types.map((type, index) => (
                <Badge key={index} variant="outline">
                  {type
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No tax types
              </span>
            )}
          </div>
        </div>

        {order.is_taxable_income && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">Taxable Income</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
