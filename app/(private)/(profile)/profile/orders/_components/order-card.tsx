import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IOrder, useInitTaxStepThreePaymentMutation } from "@/redux/api/order/orderApi";
import { Calendar, CreditCard, Hash, Phone } from "lucide-react";

interface OrderCardProps {
  order: IOrder & { _id?: string; createdAt?: string };
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const getStatusVariant = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "order_placed":
      case "completed":
        return "default";
      case "draft":
      case "in_progress":
        return "secondary";
      case "cancelled":
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const isPaid = Number(order.fee_due_amount || 0) <= 0;

  const [initTaxStepThreePayment] = useInitTaxStepThreePaymentMutation();

  const handlePayment = async () => {
    if (!order._id || isPaid) return;
    const res = await initTaxStepThreePayment(order._id).unwrap();
    if (res?.success && res.data?.gatewayPageURL) {
      window.location.href = res.data.gatewayPageURL as string;
    }
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
            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
            <Badge className="cursor-pointer" onClick={handlePayment} variant={isPaid ? "default" : "destructive"}>
              {isPaid ? "Paid" : "Unpaid"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Mobile:</span>
            <span className="font-medium">{order.personal_iformation?.phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Current Step:</span>
            <span className="font-medium">{order.current_step}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tax Year:</span>
            <span className="font-medium">{order.tax_year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Fee Due:</span>
            <span className="font-medium">৳{order.fee_due_amount || 0}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Source of Income:</div>
          <div className="flex flex-wrap gap-2">
            {order.source_of_income && order.source_of_income.length > 0 ? (
              order.source_of_income.map((type, index) => (
                <Badge key={index} variant="outline">
                  {type}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No sources provided</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
