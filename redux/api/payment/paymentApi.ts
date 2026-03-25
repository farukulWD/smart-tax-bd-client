import { IPayment } from "@/types/payment";
import { baseApi } from "../baseApi";
import { TResponse } from "@/types/common";

const paymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createPayment: builder.mutation<TResponse<IPayment>, any>({
      query: (data) => ({
        url: "/payments/initialize",
        method: "POST",
        data,
      }),
      invalidatesTags: ["payments"],
    }),
    paymentSuccess: builder.mutation<
      TResponse<IPayment>,
      { tran_id: string; paymentFor?: string }
    >({
      query: ({ tran_id, paymentFor }) => ({
        url:
          paymentFor === "fee_amount"
            ? "/tax-orders/payment/success"
            : "/payments/success",
        method: "POST",
        data: { tran_id },
      }),
      invalidatesTags: ["payments"],
    }),
    getMyPayments: builder.query<TResponse<IPayment[]>, void>({
      query: () => ({
        url: "/payments/user-payment",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetMyPaymentsQuery,
  usePaymentSuccessMutation,
} = paymentApi;
