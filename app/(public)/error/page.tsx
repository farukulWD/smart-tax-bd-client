import PaymentStatusView from "@/components/payment/payment-status-view";
import { Suspense } from "react";

const PaymentErrorPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentStatusView
        status="failed"
        title="Payment Error"
        description="Something went wrong while processing your payment."
      />
    </Suspense>
  );
};

export default PaymentErrorPage;
