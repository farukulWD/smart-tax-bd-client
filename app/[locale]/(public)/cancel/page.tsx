import PaymentStatusView from "@/components/payment/payment-status-view";
import { Suspense } from "react";

const PaymentCancelPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentStatusView
        status="cancelled"
        title="Payment Cancelled"
        description="You cancelled the payment. You can try again from your orders."
      />
    </Suspense>
  );
};

export default PaymentCancelPage;
