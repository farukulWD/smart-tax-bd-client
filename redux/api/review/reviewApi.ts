import { baseApi } from "@/redux/api/baseApi";
import { TResponse } from "@/types/common";

export interface IReview {
  _id: string;
  user?: string;
  reviewerName: string;
  reviewerPhoto?: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export interface IReviewListQuery {
  page?: number;
  limit?: number;
}

export interface IUpsertMyReviewPayload {
  rating: number;
  comment: string;
}

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicReviews: builder.query<TResponse<IReview[]>, IReviewListQuery | void>({
      query: (params) => ({
        url: "/reviews",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["reviews"],
    }),
    getMyReview: builder.query<TResponse<IReview | null>, void>({
      query: () => ({
        url: "/reviews/me",
        method: "GET",
      }),
      providesTags: ["reviews"],
    }),
    upsertMyReview: builder.mutation<TResponse<IReview>, IUpsertMyReviewPayload>({
      query: (data) => ({
        url: "/reviews/me",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useGetPublicReviewsQuery,
  useGetMyReviewQuery,
  useUpsertMyReviewMutation,
} = reviewApi;
