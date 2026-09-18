"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { readLocalized } from "@/lib/localize";
import { useGetTaxTypesQuery } from "@/redux/api/order/orderApi";

/**
 * Orders store tax type `value` keys; this turns one into its title in the
 * current locale, falling back to the raw key for a tax type since deleted.
 */
export const useTaxTypeTitle = () => {
  const locale = useLocale();
  const { data } = useGetTaxTypesQuery(undefined);
  const taxTypes = data?.data;

  return useCallback(
    (value: string) => {
      const taxType = taxTypes?.find((item) => item.value === value);
      return taxType ? readLocalized(taxType.title, locale) || value : value;
    },
    [taxTypes, locale],
  );
};
