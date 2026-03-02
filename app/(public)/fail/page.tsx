import { PaymentStatusView } from "@/components/payment/payment-status-view";

const PaymentFailPage = () => {
  return (
    <PaymentStatusView
      status="failed"
      title="Payment Failed"
      description="Your payment could not be completed. Please try again."
    />
  );
};

export default PaymentFailPage;

