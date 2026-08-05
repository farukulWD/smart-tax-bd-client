"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Skeleton } from "../ui/skeleton";
import { useGetTaxTypesQuery } from "@/redux/api/order/orderApi";
import { readLocalized } from "@/lib/localize";
import { getInitials, isIconUrl } from "./helper/ui-data";

const TaxesTypes: FC = () => {
  const t = useTranslations("taxTypes");
  const locale = useLocale();
  const { data: taxTypes, isLoading } = useGetTaxTypesQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data?.data,
      isLoading: result.isLoading,
    }),
  });

  return (
    <section id="tax-categories" className="scroll-mt-24 px-4 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3">
          <h2 className="text-2xl font-bold text-foreground">
            {t("title")} {t("titleSuffix")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {isLoading &&
            Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={`tax-skeleton-${index}`}
                className="aspect-square rounded-2xl"
              />
            ))}

          {!isLoading &&
            taxTypes?.map((taxType) => (
              <Link
                key={taxType.value}
                href={`/profile/orders/create?taxType=${taxType.value}`}
                className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-border bg-card p-2 shadow-sm transition-colors hover:bg-accent/40"
              >
                <div className="relative mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  {isIconUrl(taxType.icon) ? (
                    <Image
                      src={taxType.icon!}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs font-bold text-secondary-foreground">
                      {getInitials(readLocalized(taxType.title, "en"))}
                    </span>
                  )}
                </div>

                <span className="line-clamp-3 text-center text-xs font-semibold text-foreground">
                  {readLocalized(taxType.title, locale)}
                </span>
              </Link>
            ))}
        </div>

        {!isLoading && (!taxTypes || taxTypes.length === 0) && (
          <div className="py-10 text-center">
            <p className="text-sm font-semibold text-foreground">
              {t("noCategories")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("noCategoriesDesc")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaxesTypes;
