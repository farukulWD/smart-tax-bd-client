import { baseApi } from "@/redux/api/baseApi";
import { TResponse } from "@/types/common";

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorName: string;
  status: "draft" | "published";
  publishedAt?: string;
  views: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBlogListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query<TResponse<IBlog[]>, IBlogListQuery>({
      query: (params) => ({
        url: "/blogs",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),
    getBlogCategories: builder.query<TResponse<string[]>, void>({
      query: () => ({
        url: "/blogs/categories",
        method: "GET",
      }),
      providesTags: ["blog"],
    }),
  }),
});

export const { useGetAllBlogsQuery, useGetBlogCategoriesQuery } = blogApi;
