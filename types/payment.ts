export interface IPayment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  transactionId?: string;
  paymentMethod?: string;
  gatewayPageURL?: string | null;
  paid?: boolean;
  createdAt: string;
  updatedAt: string;
}
