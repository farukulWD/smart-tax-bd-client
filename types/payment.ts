export interface IPayment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  paymentMethod?: string;
  gatewayPageURL?: string;
  createdAt: string;
  updatedAt: string;
}
