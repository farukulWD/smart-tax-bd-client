import { TResponse } from "@/types";
import { baseApi } from "../baseApi";

// Documents issued by the admin (Acknowledgement, Tax Certificate, ...).
export interface ITaxDocument {
  _id: string;
  name: string;
  type: string;
  file: string;
  userId: string;
  orderId: { _id: string; tax_year: string; status: string } | null;
  createdAt: string;
  updatedAt: string;
}

const fileApi = baseApi.injectEndpoints({
  overrideExisting: true,
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
    getMyTaxDocuments: builder.query<TResponse<ITaxDocument[]>, undefined>({
      query: () => ({
        url: "/files/get-user-tax-documents",
        method: "GET",
      }),
      providesTags: ["files"],
    }),
    getSingleFile: builder.query<TResponse<any>, string>({
      query: (id) => ({
        url: `/files/get-single-file/${id}`,
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
  useGetMyTaxDocumentsQuery,
  useGetSingleFileQuery,
  useDeleteFileMutation,
} = fileApi;
