import { IPayment } from "@/types/payment";
import { baseApi } from "../baseApi";
import { TResponse } from "@/types/common";


const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPayment: builder.mutation<TResponse<IPayment>, any>({
            query: (data) => ({
                url: "/payments/initialize",
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

export const { useCreatePaymentMutation, useGetMyPaymentsQuery } = paymentApi;