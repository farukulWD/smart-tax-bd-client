import PaymentStatusView from "@/components/payment/payment-status-view";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

const PaymentFailPage = () => {
  const t = useTranslations("paymentStatus");
  return (
    <Suspense fallback={null}>
      <PaymentStatusView
        status="failed"
        title={t("failed.title")}
        description={t("failed.description")}
      />
    </Suspense>
  );
};

export default PaymentFailPage;
