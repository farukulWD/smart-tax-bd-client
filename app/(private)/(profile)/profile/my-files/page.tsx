"use client";

import { UploadDialog } from "./_components/upload-dialog";
import { useGetMyFilesQuery } from "@/redux/api/file/fileApi";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./_components/columns";

const MyFilesPage = () => {
  const { data: files, isLoading } = useGetMyFilesQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data?.data,
      isLoading: result.isLoading,
    }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Files</h2>
        <UploadDialog />
      </div>
      <DataTable columns={columns} data={files || []} loading={isLoading} />
    </div>
  );
};

export default MyFilesPage;
