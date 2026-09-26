"use client";

import { TaxDocumentCard } from "./_components/tax-document-card";
import {
  ITaxDocument,
  useGetMyTaxDocumentsQuery,
} from "@/redux/api/file/fileApi";
import { FileX } from "lucide-react";
import { useTranslations } from "next-intl";

// Group by the order's tax year so each filed return reads as one set.
const groupByTaxYear = (documents: ITaxDocument[]) => {
  const groups = new Map<string, ITaxDocument[]>();
  for (const document of documents) {
    const key = document.orderId?.tax_year ?? "";
    groups.set(key, [...(groups.get(key) ?? []), document]);
  }
  return Array.from(groups.entries());
};

const TaxDocumentsPage = () => {
  const t = useTranslations("taxDocuments");
  const { data: documents, isLoading, isError } = useGetMyTaxDocumentsQuery(
    undefined,
    {
      selectFromResult: (result) => ({
        data: result.data?.data,
        isLoading: result.isLoading,
        isError: result.isError,
      }),
    },
  );

  const isEmpty =
    !isLoading && !isError && (!documents || documents.length === 0);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">{t("errorLoading")}</p>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed bg-muted/30 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <FileX className="h-10 w-10 text-primary/60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{t("emptyTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("emptyDesc")}</p>
          </div>
        </div>
      )}

      {documents &&
        groupByTaxYear(documents).map(([taxYear, group]) => (
          <section key={taxYear || "other"} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {taxYear ? t("taxYear", { year: taxYear }) : t("otherDocuments")}
            </h3>
            <div className="space-y-3">
              {group.map((document) => (
                <TaxDocumentCard key={document._id} document={document} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
};

export default TaxDocumentsPage;
