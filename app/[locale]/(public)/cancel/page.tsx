import PaymentStatusView from "@/components/payment/payment-status-view";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

const PaymentCancelPage = () => {
  const t = useTranslations("paymentStatus");
  return (
    <Suspense fallback={null}>
      <PaymentStatusView
        status="cancelled"
        title={t("cancelled.title")}
        description={t("cancelled.description")}
      />
    </Suspense>
  );
};

export default PaymentCancelPage;
