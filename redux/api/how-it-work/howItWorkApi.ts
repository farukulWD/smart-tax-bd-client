import { baseApi } from "@/redux/api/baseApi";
import { TResponse } from "@/types/common";

export interface IHowItWork {
  _id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHowItWorkSection {
  _id: string;
  badge?: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

const howItWorkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHowItWorks: builder.query<TResponse<IHowItWork[]>, void>({
      query: () => ({
        url: "/how-it-works",
        method: "GET",
      }),
      providesTags: ["howItWorks"],
    }),
    getHowItWorkSection: builder.query<TResponse<IHowItWorkSection | null>, void>({
      query: () => ({
        url: "/how-it-works/section",
        method: "GET",
      }),
      providesTags: ["howItWorksSection"],
    }),
  }),
});

export const { useGetHowItWorksQuery, useGetHowItWorkSectionQuery } = howItWorkApi;
