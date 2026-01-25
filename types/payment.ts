export interface IPayment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  payment_method?: string;
  gatewayPageURL?: string;
  createdAt: string;
  updatedAt: string;
}
