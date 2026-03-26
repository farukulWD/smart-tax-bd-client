import { TResponse } from "@/types";
import { baseApi } from "../baseApi";

export interface INews {
  _id: string;
  title: string;
  description: string;
  attachment?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNews: builder.query<TResponse<INews[]>, void>({
      query: () => ({
        url: "/update-news/get-all-news",
        method: "GET",
      }),
      providesTags: ["news"],
    }),
    getSingleNews: builder.query<TResponse<INews>, string>({
      query: (id) => ({
        url: `/update-news/get-news/${id}`,
        method: "GET",
      }),
      providesTags: ["news"],
    }),
  }),
});

export const { useGetAllNewsQuery, useGetSingleNewsQuery } = newsApi;
