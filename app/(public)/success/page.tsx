import PaymentStatusView from "@/components/payment/payment-status-view";

const PaymentSuccessPage = () => {
  return (
    <PaymentStatusView
      status="success"
      title="Payment Successful"
      description="Your payment has been completed successfully."
    />
  );
};

export default PaymentSuccessPage;
