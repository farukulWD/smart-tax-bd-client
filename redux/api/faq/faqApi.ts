import { baseApi } from "@/redux/api/baseApi";
import { TResponse } from "@/types/common";

export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<TResponse<IFaq[]>, void>({
      query: () => ({
        url: "/faqs",
        method: "GET",
      }),
      providesTags: ["faqs"],
    }),
  }),
});

export const { useGetFaqsQuery } = faqApi;
