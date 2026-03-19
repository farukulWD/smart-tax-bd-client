import PaymentStatusView from "@/components/payment/payment-status-view";
import { Suspense } from "react";

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentStatusView
        status="success"
        title="Payment Successful"
        description="Your payment has been completed successfully."
      />
    </Suspense>
  );
};

export default PaymentSuccessPage;
