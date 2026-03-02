import { PaymentStatusView } from "@/components/payment/payment-status-view";

const PaymentCancelPage = () => {
  return (
    <PaymentStatusView
      status="cancelled"
      title="Payment Cancelled"
      description="You cancelled the payment. You can try again from your orders."
    />
  );
};

export default PaymentCancelPage;

