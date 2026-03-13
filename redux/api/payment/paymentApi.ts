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
    paymentSuccess: builder.mutation<TResponse<IPayment>, { tran_id: string }>({
      query: (data) => ({
        url: "/tax-orders/payment/success",
        method: "POST",
        data,
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
