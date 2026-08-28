import { TResponse } from "@/types";
import { baseApi } from "../baseApi";
import { IOrder } from "../order/orderApi";

const couponApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // The discount is computed and stored server-side; the client only ever
    // sends the code and re-reads the order.
    applyCoupon: builder.mutation<
      TResponse<{ tax_order: IOrder }>,
      { taxId: string; code: string }
    >({
      query: ({ taxId, code }) => ({
        url: `/tax-orders/${taxId}/apply-coupon`,
        method: "POST",
        data: { code },
      }),
      invalidatesTags: ["orders"],
    }),
    removeCoupon: builder.mutation<TResponse<{ tax_order: IOrder }>, string>({
      query: (taxId) => ({
        url: `/tax-orders/${taxId}/coupon`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const { useApplyCouponMutation, useRemoveCouponMutation } = couponApi;
