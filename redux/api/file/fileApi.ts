import { TResponse } from "@/types";
import { baseApi } from "../baseApi";

const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<TResponse<any>, any>({
      query: (data) => ({
        url: "/files/create-file",
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["files"],
    }),
    getMyFiles: builder.query<TResponse<any>, undefined>({
      query: () => ({
        url: "/files/get-user-files",
        method: "GET",
      }),
      providesTags: ["files"],
    }),
    deleteFile: builder.mutation<TResponse<any>, string>({
      query: (id) => ({
        url: `/files/delete-file/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["files"],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetMyFilesQuery,
  useDeleteFileMutation,
} = fileApi;
