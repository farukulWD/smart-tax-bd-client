import PaymentStatusView from "@/components/payment/payment-status-view";
import { Suspense } from "react";

const PaymentFailPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentStatusView
        status="failed"
        title="Payment Failed"
        description="Your payment could not be completed. Please try again."
      />
    </Suspense>
  );
};

export default PaymentFailPage;
