"use client";

import { useGetMyPaymentsQuery } from "@/redux/api/payment/paymentApi";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./_components/payment-columns";
import { Loader2, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

const PaymentsPage = () => {
  const t = useTranslations("paymentsPage");
  const { data, isLoading, isError } = useGetMyPaymentsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <CreditCard className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">{t("errorTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("errorDesc")}</p>
        </div>
      </div>
    );
  }

  const payments = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={payments} />
      </div>
    </div>
  );
};

export default PaymentsPage;
