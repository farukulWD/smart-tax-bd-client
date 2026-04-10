import PaymentStatusView from "@/components/payment/payment-status-view";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

const PaymentErrorPage = () => {
  const t = useTranslations("paymentStatus");
  return (
    <Suspense fallback={null}>
      <PaymentStatusView
        status="failed"
        title={t("error.title")}
        description={t("error.description")}
      />
    </Suspense>
  );
};

export default PaymentErrorPage;
