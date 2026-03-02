import { PaymentStatusView } from "@/components/payment/payment-status-view";

const PaymentErrorPage = () => {
  return (
    <PaymentStatusView
      status="failed"
      title="Payment Error"
      description="Something went wrong while processing your payment."
    />
  );
};

export default PaymentErrorPage;

