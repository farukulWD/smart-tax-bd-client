import PaymentStatusView from "@/components/payment/payment-status-view";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

const PaymentSuccessPage = () => {
  const t = useTranslations("paymentStatus");
  return (
    <Suspense fallback={null}>
      <PaymentStatusView
        status="success"
        title={t("success.title")}
        description={t("success.description")}
      />
    </Suspense>
  );
};

export default PaymentSuccessPage;
